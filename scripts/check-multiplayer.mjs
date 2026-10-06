import assert from 'node:assert/strict';
const base='http://127.0.0.1:5173';
class Chef{cookie='';constructor(name){this.name=name}async req(body,code){const r=await fetch(base+(code?'/api/game?code='+code:'/api/game'),{method:body?'POST':'GET',headers:{...(body?{'Content-Type':'application/json',Origin:base}:{}),...(this.cookie?{Cookie:this.cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});const cookie=r.headers.get('set-cookie');if(cookie)this.cookie=cookie.split(';')[0];return {status:r.status,...await r.json()}}}
const a=new Chef('Alex'),b=new Chef('Maya'),c=new Chef('Sam');
let r=await a.req({action:'create',name:a.name});assert.equal(r.phase,'lobby',JSON.stringify(r));const code=r.code;
await Promise.all([b.req({action:'join',code,name:b.name}),c.req({action:'join',code,name:c.name})]);r=await a.req(null,code);assert.equal(r.players.length,3);console.log('PASS: concurrent joins preserve all three players. Room '+code);
assert.equal((await b.req({action:'start',code})).status,400);console.log('PASS: non-host start rejected.');
const bowl={base:'classic',title:'Test bowl',pieces:[{id:'strawberry',x:50,y:50,size:15,rotation:0}]};
for(let round=1;round<=3;round++){
 r=await a.req({action:round===1?'start':'next',code});assert.equal(r.round,round,JSON.stringify(r));assert.equal(r.deadline-r.serverNow,105000);assert.equal(r.entries.length,0);
 let result=await a.req({action:'save',code,round,bowl});assert.equal(result.myBowl.pieces.length,1);assert.equal((await b.req(null,code)).myBowl.pieces.length,0);
 const reconnected=new Chef('Alex');reconnected.cookie=a.cookie;assert.equal((await reconnected.req(null,code)).myBowl.title,'Test bowl');
 await Promise.all([a.req({action:'submit',code,round,bowl}),b.req({action:'submit',code,round,bowl:{...bowl,title:'Maya bowl'}}),c.req({action:'submit',code,round,bowl:{...bowl,title:'Sam bowl'}})]);
 assert.equal((await a.req({action:'save',code,round,bowl})).status,400);console.log('PASS round '+round+': 105-second deadline, isolated drafts, reconnect, submission lock.');
 const until=r.deadline-Date.now()+150;const heartbeat=setInterval(()=>Promise.all([a.req(null,code),b.req(null,code),c.req(null,code)]),8000);await new Promise(resolve=>setTimeout(resolve,Math.max(0,until)));clearInterval(heartbeat);
 const views=await Promise.all([a.req(null,code),b.req(null,code),c.req(null,code)]);assert(views.every(v=>v.phase==='vote'));assert(views[0].entries.every(e=>!('name' in e)));const ownA=views[0].entries.find(e=>e.mine).ballot,ownB=views[1].entries.find(e=>e.mine).ballot;
 assert.equal((await a.req({action:'vote',code,round,ballot:ownA})).status,400);
 await a.req({action:'vote',code,round,ballot:ownB});assert.equal((await a.req({action:'vote',code,round,ballot:ownB})).status,400);
 await Promise.all([b.req({action:'vote',code,round,ballot:ownA}),c.req({action:'vote',code,round,ballot:ownA})]);
 r=await a.req(null,code);assert.equal(r.phase,round===3?'final':'results');assert.equal(r.players.find(p=>p.name==='Alex').score,round*2);assert.equal(r.players.find(p=>p.name==='Maya').score,round);console.log('PASS round '+round+': synchronized reveal, anonymity, no self/duplicate votes, correct scores.');
}
r=await a.req({action:'rematch',code});assert.equal(r.phase,'lobby');assert(r.players.every(p=>p.score===0));console.log('PASS: rematch resets scores. ALL MULTIPLAYER CHECKS PASSED.');
