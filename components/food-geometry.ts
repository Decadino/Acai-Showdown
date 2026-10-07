import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
const cache=new Map<string,T.BufferGeometry>();
export function ingredientGeometry(id:string){
 if(cache.has(id))return cache.get(id)!;const parts:T.BufferGeometry[]=[];
 const add=(g:T.BufferGeometry,color:string,x=0,y=0,z=0,sx=1,sy=1,sz=1,ry=0)=>{g.scale(sx,sy,sz);g.rotateY(ry);g.translate(x,y,z);if(g.index)g=g.toNonIndexed();g.deleteAttribute('uv');const c=new T.Color(color),a=new Float32Array(g.getAttribute('position').count*3);for(let i=0;i<a.length;i+=3){a[i]=c.r;a[i+1]=c.g;a[i+2]=c.b;}g.setAttribute('color',new T.BufferAttribute(a,3));parts.push(g);};
 const ball=(c:string,x=0,y=.12,z=0,sx=.4,sy=.2,sz=.4)=>add(new T.SphereGeometry(1,12,8),c,x,y,z,sx,sy,sz);
 const disk=(r:number,h:number,c:string,y=0)=>add(new T.CylinderGeometry(r,r,h,32),c,0,y+h/2,0);
 const shape=(points:[number,number][],color:string,h=.13)=>{const sh=new T.Shape(points.map(([x,y])=>new T.Vector2(x,y)));const g=new T.ExtrudeGeometry(sh,{depth:h,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.035,bevelThickness:.025,curveSegments:16});g.rotateX(-Math.PI/2);add(g,color);};
 if(['honey','cocoa','peanut','vanilla'].includes(id)){
  const points:T.Vector3[]=[];for(let row=0;row<6;row++){const z=-.8+row*.32;for(let j=0;j<7;j++)points.push(new T.Vector3((row%2?1:-1)*(-.8+j*.27),.07,z+Math.sin(j*.6)*.025));}
  add(new T.TubeGeometry(new T.CatmullRomCurve3(points),100,.032,6,false),({honey:'#e5a632',cocoa:'#4b2313',peanut:'#c28b52',vanilla:'#fff1d1'} as Record<string,string>)[id]);
 }else if(id==='banana'){
  disk(.47,.14,'#ead295');disk(.425,.015,'#fff0b4',.14);ball('#fff6cc',0,.16,0,.18,.013,.18);for(let i=0;i<6;i++){const a=i*Math.PI/3;ball('#b78b46',Math.sin(a)*.14,.177,Math.cos(a)*.14,.018,.006,.03);}
 }else if(id==='kiwi'){
  disk(.48,.14,'#806338');disk(.44,.018,'#89be3c',.14);disk(.14,.02,'#eff5b8',.159);for(let i=0;i<22;i++){const a=i*2*Math.PI/22;ball('#2b3220',Math.cos(a)*.29,.171,Math.sin(a)*.29,.016,.008,.03);}
 }else if(id==='strawberry'){
  const sh=new T.Shape();sh.moveTo(0,-.5);sh.bezierCurveTo(-.2,-.3,-.55,.1,-.4,.32);sh.bezierCurveTo(-.26,.5,-.04,.35,0,.32);sh.bezierCurveTo(.1,.43,.34,.49,.44,.25);sh.bezierCurveTo(.55,.04,.16,-.35,0,-.5);const g=new T.ExtrudeGeometry(sh,{depth:.14,bevelEnabled:true,bevelSize:.04,bevelThickness:.025,bevelSegments:2,curveSegments:16});g.rotateX(-Math.PI/2);add(g,'#ed3659');
  for(let i=0;i<19;i++){const a=i*2.4,r=.08+Math.sqrt(i/19)*.31;ball('#ffe695',Math.cos(a)*r,.19,Math.sin(a)*r,.014,.009,.025);}
 }else if(id==='blueberry'){
  ball('#3f5aa6',0,.24,0,.42,.32,.42);for(let i=0;i<5;i++){const a=i*1.256;ball('#222d62',Math.cos(a)*.095,.553,Math.sin(a)*.095,.04,.016,.075);}
 }else if(id==='raspberry'){
  for(let i=0;i<20;i++){const a=i*2.4,r=Math.sqrt(i/20)*.32;ball(i%3?'#dd3962':'#f65a7c',Math.cos(a)*r,.18+(1-r/.45)*.23,Math.sin(a)*r,.11,.11,.11);}
 }else if(id==='mango'){
  shape([[-.4,-.34],[.3,-.4],[.45,.17],[.29,.4],[-.34,.32]],'#ffba35',.23);ball('#ffd05d',0,.26,0,.31,.014,.27);
 }else if(id==='pineapple'){
  shape([[-.45,-.4],[.47,-.32],[.13,.44]],'#ffdd61',.18);for(let i=0;i<6;i++)ball('#e2af38',-.27+i*.1,.205,-.15,.015,.006,.19);
 }else if(id==='dragonfruit'){
  ball('#ef4387',0,.12,0,.45,.12,.43);ball('#fff1e8',0,.2,0,.39,.065,.37);for(let i=0;i<18;i++){const a=i*2.4,r=Math.sqrt(i/18)*.32;ball('#342e3c',Math.cos(a)*r,.26,Math.sin(a)*r,.012,.008,.018);}
 }else if(id==='flower'){
  for(let i=0;i<6;i++){const a=i*Math.PI/3;ball(i%2?'#f49ac9':'#ba6ab5',Math.cos(a)*.25,.08,Math.sin(a)*.25,.19,.065,.22);}ball('#f9c45d',0,.14,0,.12,.065,.12);
 }else if(id==='almond'){
  ball('#e5c38d',0,.05,0,.18,.055,.43);ball('#fff0c2',0,.087,0,.13,.019,.34);
 }else if(id==='coconut'){
  shape([[-.33,-.32],[.39,-.22],[.26,.31],[-.21,.39]],'#fff6e7',.035);
 }else if(id==='pistachio'){
  ball('#e3d6a3',0,.14,0,.28,.15,.38);ball('#8daa3c',0,.24,0,.19,.1,.3);ball('#b3ca66',-.05,.30,-.05,.06,.02,.15);
 }else if(id==='chocolate'){
  add(new T.ConeGeometry(.33,.4,12),'#653623',0,.22,0);disk(.34,.06,'#4d271a');
 }else{
  const chia=id==='chia',cacao=id==='cacao';for(let i=0;i<(chia?12:7);i++){const a=i*2.4,r=.1+Math.sqrt(i/12)*.3;const g=chia?new T.SphereGeometry(1,6,4):new T.IcosahedronGeometry(1,0);const size=chia?.065:cacao?.16:.17;add(g,chia?(i%3?'#363245':'#9a9298'):cacao?(i%2?'#563427':'#765246'):(i%2?'#d49b53':'#edc477'),Math.cos(a)*r,.08+(i%3)*.045,Math.sin(a)*r,size,size*.7,size*1.1,i);}
 }
 const combined=mergeGeometries(parts,false)!;parts.forEach(p=>p.dispose());combined.computeBoundingSphere();cache.set(id,combined);return combined;
}
