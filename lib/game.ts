export const ROUND_MS=60000;
export const VOTE_MS=20000;
export const MAX_PLAYERS=6;
export const THEMES=[
 ['Tropical getaway','Bring island sunshine to your bowl.'],['Berry couture','Style a bowl fit for a fashion runway.'],['Midnight garden','A dark, dreamy bowl with something in bloom.'],['Golden hour','Warm colors, golden fruit, sunset energy.'],['Dessert after dark','Go rich, decadent, and a little dramatic.'],['Rainbow road','Arrange your ingredients into a spectrum.'],['Zen garden','Balance, clean lines, and breathing room.'],['Flower power','Build an edible bouquet.'],['Beach picnic','A bowl that belongs beside the ocean.'],['Cosmic crunch','Invent a tiny, delicious galaxy.'],['Pretty in pink','Make pink the star of the show.'],['Jungle jewels','Go green with flashes of tropical color.'],['Breakfast club','A beautifully arranged morning ritual.'],['Chocolate daydream','Chocolate lovers, this is your moment.'],['Minimal masterpiece','Make a big impression with three ingredient types or fewer.'],['Fruit fireworks','An explosion of color from the center outward.'],['Strawberry social','Give strawberries the starring role.'],['Moonlight mosaic','Make a pattern from tiny delicious pieces.'],['Pistachio paradise','Celebrate green, gold, and a little crunch.'],['Sunday in Paris','Elegant, intentional, café-worthy.'],['A bowl with a face','Give your creation a personality.'],['Sweet symmetry','Make both sides beautifully balanced.'],['The wild card','Surprise everyone with an unexpected combination.'],['Signature serve','Make the bowl you would put your name on.']
].map(([name,description],id)=>({id,name,description}));
export const INGREDIENTS=[
 ['strawberry','Strawberry','Fruit'],['banana','Banana','Fruit'],['mango','Mango','Fruit'],['blueberry','Blueberry','Fruit'],['kiwi','Kiwi','Fruit'],['raspberry','Raspberry','Fruit'],['pineapple','Pineapple','Fruit'],['dragonfruit','Dragonfruit','Fruit'],['granola','Granola','Crunch'],['coconut','Coconut flakes','Crunch'],['almond','Almond slivers','Crunch'],['cacao','Cacao nibs','Crunch'],['chia','Chia seeds','Crunch'],['pistachio','Pistachio','Crunch'],['chocolate','Chocolate chips','Crunch'],['flower','Edible flowers','Finish'],['honey','Golden honey','Drizzle'],['cocoa','Chocolate sauce','Drizzle'],['peanut','Peanut butter','Drizzle'],['vanilla','Vanilla yogurt','Drizzle']
].map(([id,name,category],sprite)=>({id,name,category,sprite}));
export const BASES=[{id:'classic',name:'Classic açaí',color:'#6a193e'},{id:'pitaya',name:'Pink pitaya',color:'#d63382'},{id:'blue',name:'Blue spirulina',color:'#2482a3'}];
export type Piece={id:string;x:number;y:number;rotation:number;size:number};
export type Bowl={base:string;pieces:Piece[];title:string};
export const blankBowl=():Bowl=>({base:'classic',pieces:[],title:''});
export type Player={id:string;name:string;joined:number;seen:number;active:boolean;score:number;ready:boolean;bowl:Bowl;ballot:string;vote:string|null};
export type Room={code:string;host:string;phase:'lobby'|'build'|'vote'|'results'|'final';round:number;deadline:number;themes:number[];players:Player[];scored:boolean;created:number};
export function cleanBowl(input:unknown):Bowl{
 if(!input||typeof input!=='object')throw Error('Your bowl could not be read.');const b=input as Bowl;
 if(!BASES.some(x=>x.id===b.base)||!Array.isArray(b.pieces)||b.pieces.length>64)throw Error('Use up to 64 toppings.');
 const pieces=b.pieces.map(p=>{if(!p||!INGREDIENTS.some(x=>x.id===p.id)||![p.x,p.y,p.rotation,p.size].every(Number.isFinite)||p.size<6||p.size>40||Math.hypot(p.x-50,p.y-50)>39)throw Error('Keep your ingredients inside the bowl.');return {id:p.id,x:p.x,y:p.y,rotation:p.rotation%360,size:p.size}});
 return {base:b.base,pieces,title:typeof b.title==='string'?b.title.trim().slice(0,32):''};
}
export function advance(room:Room,now:number){
 let changed=false;
 if(room.phase==='build'&&now>=room.deadline){room.phase='vote';room.deadline=now+VOTE_MS;changed=true;}
 const eligible=room.players.filter(p=>p.active);
 if(room.phase==='vote'&&(now>=room.deadline||(eligible.length>0&&eligible.every(p=>p.vote)))){
  if(!room.scored){for(const p of room.players){const target=room.players.find(t=>t.ballot===p.vote&&t.id!==p.id);if(target)target.score++;}room.scored=true;}
  room.phase=room.round>=3?'final':'results';room.deadline=0;changed=true;
 }
 const host=room.players.find(p=>p.id===room.host);
 if(!host?.active||now-host.seen>45000){const next=room.players.filter(p=>p.active&&now-p.seen<20000).sort((a,b)=>a.joined-b.joined)[0];if(next&&next.id!==room.host){room.host=next.id;changed=true;}}
 return changed;
}
export function startRound(room:Room,now:number){room.round++;room.phase='build';room.deadline=now+ROUND_MS;room.scored=false;for(const p of room.players){p.bowl=blankBowl();p.ready=false;p.vote=null;p.ballot=crypto.randomUUID();}}
export function publicRoom(room:Room,id:string,now:number){const me=room.players.find(p=>p.id===id);return {code:room.code,host:room.host,phase:room.phase,round:room.round,deadline:room.deadline,serverNow:now,theme:THEMES[room.themes[Math.max(0,room.round-1)]],me:id,players:room.players.map(p=>({id:p.id,name:p.name,score:p.score,ready:p.ready,online:p.active&&now-p.seen<25000,voted:!!p.vote})),myBowl:me?.bowl,myReady:me?.ready,myVote:me?.vote,entries:['vote','results','final'].includes(room.phase)?room.players.map(p=>({ballot:p.ballot,bowl:p.bowl,mine:p.id===id,...(room.phase!=='vote'?{name:p.name,score:p.score,votes:room.players.filter(v=>v.vote===p.ballot).length}:{})})).sort((a,b)=>a.ballot.localeCompare(b.ballot)):[]};}
export type View=ReturnType<typeof publicRoom>;
