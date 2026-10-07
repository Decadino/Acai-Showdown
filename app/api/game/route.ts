import {validateChefName,friendlyDisplayName} from '@/lib/name-filter';
import {ROUND_MODES,REACTIONS} from '@/lib/engagement';
import {database} from '@/lib/storage';
import {VOTE_MS,saveMutatedBowl,revealMystery,rollMutations,AWARDS,roundBudget,advance,blankBowl,cleanBowl,MAX_PLAYERS,publicRoom,startRound,THEMES,type Room,type Player} from '@/lib/game';
export const dynamic='force-dynamic';
const headers={'Cache-Control':'no-store','Content-Type':'application/json'};
async function identity(req:Request){let token=req.headers.get('cookie')?.match(/(?:^|;\s*)acai_session=([a-f0-9]{64})(?:;|$)/)?.[1];if(!token)token=Array.from(crypto.getRandomValues(new Uint8Array(32))).map(x=>x.toString(16).padStart(2,'0')).join('');const hash=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(token));const id=Array.from(new Uint8Array(hash)).map(x=>x.toString(16).padStart(2,'0')).join('');return {id,cookie:`acai_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000${new URL(req.url).protocol==='https:'?'; Secure':''}`};}
function response(data:unknown,status=200,cookie:string|null=null){return new Response(JSON.stringify(data,(key,value)=>key==='name'&&typeof value==='string'?friendlyDisplayName(value):value),{status,headers:{...headers,...(cookie?{'Set-Cookie':cookie}:{})}})}
function player(id:string,name:unknown,now:number):Player{const cleanName=validateChefName(name);return {id,name:cleanName,joined:now,seen:now,active:true,score:0,ready:false,bowl:blankBowl(),ballot:crypto.randomUUID(),vote:null};}
async function handle(req:Request){let cookie:string|null=null;try{
 const auth=await identity(req);cookie=auth.cookie;const id=auth.id;const url=new URL(req.url);const now=Date.now();
 if(req.method==='POST'){const origin=req.headers.get('origin');if(origin&&origin!==url.origin)return response({error:'Please open the game directly and try again.'},403,cookie);if(Number(req.headers.get('content-length')||0)>192000)return response({error:'That bowl has too much data.'},413,cookie);}
 const raw=req.method==='POST'?await req.text():'';if(raw.length>192000)return response({error:'That bowl has too much data.'},413,cookie);
 const body=req.method==='POST'?JSON.parse(raw):{};const action=req.method==='GET'?'read':body.action;
 if(req.method==='GET'&&url.searchParams.get('profile')==='1')return response({achievements:await earnedRewards(database(),id)},200,cookie);
 if(req.method==='GET'&&url.searchParams.get('leaderboard')==='1'){const db=database();const board=await db.prepare(`WITH totals AS (SELECT player_id,SUM(won) wins,COUNT(*) games FROM match_results GROUP BY player_id), ranked AS (SELECT *,RANK() OVER (ORDER BY wins DESC) rank,ROW_NUMBER() OVER (ORDER BY wins DESC,games ASC,player_id) position FROM totals) SELECT rank,position,wins,games,(SELECT name FROM match_results m WHERE m.player_id=r.player_id ORDER BY completed_at DESC,match_id DESC LIMIT 1) name,CASE WHEN player_id=? THEN 1 ELSE 0 END mine FROM ranked r WHERE position<=50 OR player_id=? ORDER BY position`).bind(id,id).all();return response({entries:board.results},200,cookie);}
 if(req.method==='GET'&&!url.searchParams.get('code'))return response({ok:true},200,cookie);
 const db=database();
 if(action==='create'){
  const p=player(id,body.name,now);await db.prepare('DELETE FROM rooms WHERE code IN (SELECT code FROM rooms WHERE expires < ? LIMIT 100)').bind(now).run();
  const count=await db.prepare('SELECT COUNT(*) AS n FROM rooms WHERE owner = ? AND expires > ?').bind(id,now).first<{n:number}>();if((count?.n||0)>=10)return response({error:'You have 10 active rooms. Rejoin one or try again tomorrow.'},429,cookie);
  for(let i=0;i<5;i++){const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';const bytes=crypto.getRandomValues(new Uint8Array(6));const code=Array.from(bytes,x=>alphabet[x%alphabet.length]).join('');const themes=THEMES.map(x=>x.id);for(let j=themes.length-1;j>0;j--){const k=crypto.getRandomValues(new Uint32Array(1))[0]%(j+1);[themes[j],themes[k]]=[themes[k],themes[j]];}
   const room:Room={studioVersion:1,matchId:crypto.randomUUID(),roundSeconds:300,modes:['creative','budget','speed'],code,host:id,phase:'lobby',round:0,deadline:0,themes:themes.slice(0,3),players:[p],scored:false,created:now,budgetRound:2,audienceAwards:true};const inserted=await db.prepare('INSERT OR IGNORE INTO rooms (code,owner,data,version,expires) VALUES (?,?,?,0,?)').bind(code,id,JSON.stringify(room),now+43200000).run();if(inserted.meta.changes)return response(publicRoom(room,id,now),200,cookie);
  }throw Error('Could not create a room. Please try again.');
 }
 const code=String(body.code||url.searchParams.get('code')||'').trim().toUpperCase();if(!/^[A-Z2-9]{6}$/.test(code))throw Error('Enter the six-character room code.');
 for(let attempt=0;attempt<8;attempt++){
  const row=await db.prepare('SELECT data,version,expires FROM rooms WHERE code = ?').bind(code).first<{data:string;version:number;expires:number}>();if(!row||row.expires<now)return response({error:'Room not found or expired. Ask your host for a new code.'},404,cookie);
  const room=JSON.parse(row.data) as Room;let me=room.players.find(p=>p.id===id);let changed=false;if(room.phase==='vote'&&room.voteMs!==VOTE_MS){room.deadline=Math.min(room.deadline,now+VOTE_MS);room.voteMs=VOTE_MS;changed=true;}if(room.phase==='lobby'&&!room.studioVersion){room.roundSeconds=300;room.studioVersion=1;changed=true;}
  // Retire Gravity Flip in active rooms as well as already shuffled round decks.
  if(room.mutation?.id==='gravity'){room.mutation=null;changed=true;}
  if(room.mutationDeck?.some(m=>m?.id==='gravity')){room.mutationDeck=room.mutationDeck.map(m=>m?.id==='gravity'?null:m);changed=true;}
  for(const p of room.players)if(p.bowl.gravity){delete p.bowl.gravity;changed=true;}
  if(action==='join'){
   if(me){me.name=validateChefName(body.name);me.active=true;me.seen=now;changed=true;}else{if(room.phase!=='lobby')throw Error('This game has started. Join after the host opens a new game.');if(room.players.length>=MAX_PLAYERS)throw Error('This room is full. Up to six chefs can play.');me=player(id,body.name,now);room.players.push(me);changed=true;}
  }
  if(!me||!me.active)return response({error:'Join this room first.',needsJoin:true},403,cookie);
  if(now-me.seen>12000){me.seen=now;changed=true;}
  changed=advance(room,now)||changed;
  if(action==='start'||action==='next'||action==='rematch'){
   if(room.host!==id)throw Error('Only the host can start a round.');
   if(action==='rematch'){if(room.phase!=='final')throw Error('Finish this game first.');await recordMatch(db,room,now);room.round=0;room.matchId=crypto.randomUUID();room.mutationDeck=rollMutations();room.mutation=null;room.claims={};room.players=room.players.filter(p=>p.active&&now-p.seen<45000);for(const p of room.players){p.score=0;p.achievements=[];p.audienceWins=0;}room.themes=THEMES.map(t=>t.id).sort(()=>Math.random()-.5).slice(0,3);room.phase='lobby';}
   else {if((action==='start'&&room.phase!=='lobby')||(action==='next'&&room.phase!=='results'))throw Error('The room has moved to another stage.');if(room.players.filter(p=>p.active&&now-p.seen<25000).length<2)throw Error('At least two connected players are needed.');startRound(room,now);}changed=true;
   }else if(action==='settings'){
   if(room.host!==id||room.phase!=='lobby')throw Error('Only the host can choose themes in the lobby.');
   if(!Array.isArray(body.themes)||body.themes.length!==3||!body.themes.every((t:unknown)=>Number.isInteger(t)&&THEMES.some(x=>x.id===t)))throw Error('Choose a theme for each round.');
   if(body.roundSeconds!==undefined){if(![45,60,105,180,300].includes(body.roundSeconds))throw Error('Choose 45, 60, 105, or 300 seconds.');room.roundSeconds=body.roundSeconds;}if(body.modes!==undefined){if(!Array.isArray(body.modes)||body.modes.length!==3||!body.modes.every((m:unknown)=>ROUND_MODES.some(v=>v.id===m)))throw Error('Choose a mode for each round.');room.modes=body.modes;}room.themes=body.themes;room.budgetRound=2;room.audienceAwards=true;changed=true;
  }else if(action==='save'||action==='submit'){
   if(room.phase!=='build'||room.round!==body.round||me.ready)throw Error('This bowl is already locked for voting.');if(action==='submit'&&room.mutation?.id==='gravity'&&body.bowl?.gravity!=='sealed')throw Error('Choose your base last to seal the bowl before finishing.');if(body.bowl?.finish==='mosaic'||body.bowl?.countertop==='marble'||body.bowl?.effect==='lustre'){const earned=await earnedRewards(db,id);if(body.bowl.finish==='mosaic'&&!earned.includes('berry')||body.bowl.countertop==='marble'&&!earned.includes('perfect')||body.bowl.effect==='lustre'&&!earned.includes('crowd'))throw Error('Earn this achievement reward before using it in multiplayer.');}saveMutatedBowl(room,me,body.bowl);if(action==='submit')me.ready=true;changed=true;
  }else if(action==='mystery'){
   if(room.phase!=='build'||room.round!==body.round||me.ready)throw Error('This bowl is already locked for voting.');revealMystery(room,me,body.bowl,body.x,body.y,body.size);changed=true;
  }else if(action==='vote'){
   if(room.phase!=='vote'||room.round!==body.round)throw Error('Voting has closed.');if(me.vote)throw Error('Your vote is already recorded.');const target=room.players.find(p=>p.ballot===body.ballot);if(!target||target.id===id)throw Error('Choose another chef’s bowl.');me.vote=target.ballot;changed=true;advance(room,now);
   }else if(action==='award'){
   if(!room.audienceAwards||room.phase!=='vote'||room.round!==body.round)throw Error('Audience voting has closed.');
   const award=AWARDS.find(a=>a.id===body.award);if(!award)throw Error('Choose a valid audience award.');
   me.awardVotes??={};if(me.awardVotes[award.id])throw Error('Your award vote is already recorded.');
   const target=room.players.find(p=>p.ballot===body.ballot);if(!target||target.id===id)throw Error('Choose another chef’s bowl.');
   me.awardVotes[award.id]=target.ballot;changed=true;advance(room,now);
  }else if(action==='react'){
   if(room.phase!=='vote'||room.round!==body.round)throw Error('Reactions open during the reveal.');
   if(!REACTIONS.some(r=>r.id===body.kind))throw Error('Choose a reaction.');const target=room.players.find(p=>p.ballot===body.ballot);if(!target||target.id===id)throw Error('React to another chef’s bowl.');room.reactions??=[];if(room.reactions.some(r=>r.from===id&&r.ballot===target.ballot))throw Error('You already reacted to this bowl.');if(now-(me.lastReaction||0)<800)throw Error('Give your reaction a moment.');me.lastReaction=now;room.reactions.push({id:crypto.randomUUID(),from:id,ballot:target.ballot,kind:body.kind,at:now});changed=true;
  }else if(action==='leave'){me.active=false;if(room.phase==='lobby')room.players=room.players.filter(p=>p.id!==id);advance(room,now);changed=true;}
  else if(!['read','join'].includes(action))throw Error('Unknown game action.');
  if(!changed){if(room.phase==='final')await recordMatch(db,room,now);return response(publicRoom(room,id,now),200,cookie);}
  const result=await db.prepare('UPDATE rooms SET data = ?, version = version + 1 WHERE code = ? AND version = ?').bind(JSON.stringify(room),code,row.version).run();if(result.meta.changes){if(room.phase==='final')await recordMatch(db,room,now);return response(action==='leave'?{ok:true}:publicRoom(room,id,now),200,cookie);}
 }
 return response({error:'The room is busy. Please try once more.'},409,cookie);
 }catch(e){const message=e instanceof Error?e.message:'Could not connect to the game.';if(/D1|SQLITE|binding|database/i.test(message)){console.error('Game storage error',message);return response({error:'The game service is temporarily unavailable. Your bowl is still on this screen.'},503,cookie);}return response({error:message},400,cookie);}}
export const GET=handle;export const POST=handle;

// The composite key makes polling, retries, and concurrent final requests count each match once.
async function recordMatch(db:ReturnType<typeof database>,room:Room,now:number){
 if(room.round<3||room.players.length<2||!room.scored)return;
 const match=room.matchId||`${room.code}-${room.created}`;const best=Math.max(...room.players.map(p=>p.score));
 await db.batch(room.players.map(p=>db.prepare('INSERT OR IGNORE INTO match_results (match_id,player_id,name,won,score,completed_at,achievements,audience_wins) VALUES (?,?,?,?,?,?,?,?)').bind(match,p.id,p.name,p.score===best?1:0,p.score,now,JSON.stringify(p.achievements||[]),p.audienceWins||0)));
}

async function earnedRewards(db:ReturnType<typeof database>,id:string){const data=await db.prepare('SELECT achievements,audience_wins FROM match_results WHERE player_id=?').bind(id).all<{achievements:string;audience_wins:number}>();const achievements=[...new Set(data.results.flatMap(r=>JSON.parse(r.achievements||'[]') as string[]))];if(data.results.reduce((n,r)=>n+r.audience_wins,0)>=3)achievements.push('crowd');return [...new Set(achievements)];}
