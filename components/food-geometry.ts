import {FANTASY_BY_ID,SAUCE_COLORS,isSauce} from '@/lib/fantasy-ingredients';
import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
const cache=new Map<string,T.BufferGeometry>();
export function ingredientGeometry(id:string){
 if(cache.has(id))return cache.get(id)!;const parts:T.BufferGeometry[]=[];
 const add=(g:T.BufferGeometry,color:string,x=0,y=0,z=0,sx=1,sy=1,sz=1,ry=0)=>{g.scale(sx,sy,sz);g.rotateY(ry);g.translate(x,y,z);if(g.index)g=g.toNonIndexed();g.deleteAttribute('uv');const c=new T.Color(color),a=new Float32Array(g.getAttribute('position').count*3);for(let i=0;i<a.length;i+=3){const v=i/3,pos=g.getAttribute('position'),grain=.95+.09*Math.sin(pos.getX(v)*71+pos.getY(v)*53+pos.getZ(v)*97);a[i]=c.r*grain;a[i+1]=c.g*grain;a[i+2]=c.b*grain;}g.setAttribute('color',new T.BufferAttribute(a,3));parts.push(g);};
 const ball=(c:string,x=0,y=.12,z=0,sx=.4,sy=.2,sz=.4)=>add(new T.SphereGeometry(1,24,16),c,x,y,z,sx,sy,sz);
 const disk=(r:number,h:number,c:string,y=0)=>add(new T.CylinderGeometry(r,r,h,48),c,0,y+h/2,0);
 const shape=(points:[number,number][],color:string,h=.13)=>{const sh=new T.Shape(points.map(([x,y])=>new T.Vector2(x,y)));const g=new T.ExtrudeGeometry(sh,{depth:h,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.035,bevelThickness:.025,curveSegments:16});g.rotateX(-Math.PI/2);add(g,color);};
 const fantasy=FANTASY_BY_ID[id];
 if(isSauce(id)){
  const points:T.Vector3[]=[];for(let row=0;row<6;row++){const z=-.8+row*.32;for(let j=0;j<7;j++)points.push(new T.Vector3((row%2?1:-1)*(-.8+j*.27),.07,z+Math.sin(j*.6)*.025));}
  add(new T.TubeGeometry(new T.CatmullRomCurve3(points),100,.032,6,false),SAUCE_COLORS[id]);
 }else if(fantasy){
  const {color:c,accent:a,shape:form}=fantasy;
  const dots=(n=9)=>{for(let i=0;i<n;i++){const t=i*2.39996,r=.1+Math.sqrt(i/n)*.23;ball(a,Math.cos(t)*r,.20,Math.sin(t)*r,.018,.009,.018);}};
  if(form==='star'){shape(Array.from({length:10},(_,i)=>{const r=i%2?.22:.47,t=i*Math.PI/5-Math.PI/2;return [Math.cos(t)*r,Math.sin(t)*r] as [number,number]}),c,.12);ball(a,0,.16,0,.12,.015,.12);}
  else if(form==='slice'){disk(.46,.13,a);disk(.40,.016,c,.13);disk(.105,.012,a,.146);for(let i=0;i<12;i++){const t=i*Math.PI/6;ball(a,Math.cos(t)*.25,.162,Math.sin(t)*.25,.019,.006,.033);}}
  else if(form==='orb'){ball(c,0,.23,0,.35,.28,.35);for(let i=0;i<10;i++){const t=i*2.4;ball(a,Math.cos(t)*.22,.45,Math.sin(t)*.22,.025,.012,.025);}}
  else if(form==='pear'){ball(c,0,.23,0,.30,.26,.30);ball(c,0,.48,0,.18,.21,.18);ball(a,.13,.68,0,.17,.025,.065);}
  else if(form==='cherries'){ball(c,-.18,.20,0,.23,.23,.23);ball(c,.18,.20,0,.23,.23,.23);const stem=new T.CatmullRomCurve3([new T.Vector3(-.18,.4,0),new T.Vector3(0,.68,0),new T.Vector3(.18,.4,0)]);add(new T.TubeGeometry(stem,24,.018,6,false),a);}
  else if(['cluster','cloud','pearls'].includes(form)){for(let i=0;i<(form==='pearls'?8:5);i++){const t=i*2.4,r=form==='cloud'?.18:.25;ball(form==='pearls'&&i%2?a:c,Math.cos(t)*r,.16+(i%3)*.04,Math.sin(t)*r,form==='cloud'?.22:.14,form==='cloud'?.16:.13,form==='cloud'?.22:.14);}}
  else if(form==='crumbs'){for(let i=0;i<12;i++){const t=i*2.4,r=Math.sqrt(i/12)*.36;add(new T.IcosahedronGeometry(1,0),i%3?c:a,Math.cos(t)*r,.09+(i%3)*.06,Math.sin(t)*r,.11,.07,.11,i);}}
  else if(form==='loop'){const g=new T.TorusGeometry(.32,.11,12,36);g.rotateX(Math.PI/2);add(g,c,0,.12,0);for(let i=0;i<8;i++){const t=i*Math.PI/4;ball(a,Math.cos(t)*.32,.223,Math.sin(t)*.32,.025,.01,.025);}}
  else if(form==='crystal'){add(new T.OctahedronGeometry(1,0),c,0,.30,0,.35,.30,.35);add(new T.OctahedronGeometry(1,0),a,.21,.19,.10,.15,.17,.15);}
  else if(form==='spiral'){const points=Array.from({length:65},(_,i)=>{const t=i/64*Math.PI*5,r=.06+i/64*.35;return new T.Vector3(Math.cos(t)*r,.075,Math.sin(t)*r)});add(new T.TubeGeometry(new T.CatmullRomCurve3(points),96,.055,8,false),c);ball(a,0,.08,0,.065,.045,.065);}
  else if(form==='crescent'){const points:[number,number][]=[];for(let i=0;i<=32;i++){const t=Math.PI/3+i/32*Math.PI*4/3;points.push([Math.cos(t)*.46,Math.sin(t)*.46]);}for(let i=32;i>=0;i--){const t=Math.PI/3+i/32*Math.PI*4/3;points.push([.13+Math.cos(t)*.33,Math.sin(t)*.33]);}shape(points,c,.13);for(let i=0;i<5;i++)ball(a,-.29,.165,-.2+i*.1,.018,.009,.018);}
  else if(form==='planet'){ball(c,0,.22,0,.28,.25,.28);const g=new T.TorusGeometry(.43,.04,8,40);g.rotateX(Math.PI/2);add(g,a,0,.22,0);}
  else if(form==='heart'){const points:[number,number][]=Array.from({length:64},(_,i)=>{const t=i/64*Math.PI*2;return [Math.pow(Math.sin(t),3)*.43,-(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))*.027]});shape(points,c,.15);ball(a,0,.19,0,.1,.012,.10);}
  else if(form==='feather'){shape([[-.04,-.48],[-.22,-.22],[-.24,.08],[-.15,.32],[0,.48],[.13,.32],[.22,.03],[.15,-.28]],c,.07);const pts=[new T.Vector3(0,.11,-.45),new T.Vector3(-.035,.11,0),new T.Vector3(0,.11,.45)];add(new T.TubeGeometry(new T.CatmullRomCurve3(pts),24,.018,6,false),a);}
  else if(form==='scales'){for(let i=0;i<3;i++){ball(i%2?a:c,(i-1)*.22,.05+i*.035,0,.21,.045,.32);ball(a,(i-1)*.22,.09+i*.035,-.20,.10,.012,.04);}}
  else {for(let i=0;i<6;i++){const t=i*Math.PI/3;ball(i%2?a:c,Math.cos(t)*.25,.07,Math.sin(t)*.25,.17,.06,.21);}ball(a,0,.14,0,.11,.035,.11);}
 }else if(id==='banana'){
  disk(.47,.14,'#ead295');disk(.425,.015,'#fff0b4',.14);ball('#fff6cc',0,.16,0,.18,.013,.18);for(let i=0;i<6;i++){const a=i*Math.PI/3;ball('#b78b46',Math.sin(a)*.14,.177,Math.cos(a)*.14,.018,.006,.03);}
 }else if(id==='kiwi'){
  disk(.48,.085,'#806338');disk(.455,.012,'#70ad32',.085);disk(.415,.009,'#a3d34b',.097);
  for(let i=0;i<28;i++){const a=i*2*Math.PI/28;const r=.19+(i%2)*.075;ball('#253321',Math.cos(a)*r,.111,Math.sin(a)*r,.012,.004,.023);}
  ball('#f0f3bc',0,.111,0,.115,.006,.15);
  for(let i=0;i<24;i++){const a=i*2*Math.PI/24;ball('#c6e873',Math.cos(a)*.34,.108,Math.sin(a)*.34,.018,.003,.055);}
 }else if(id==='strawberry'){
  const outline=new T.Shape();outline.moveTo(0,-.48);outline.bezierCurveTo(-.12,-.35,-.46,.03,-.4,.28);outline.bezierCurveTo(-.34,.5,.34,.5,.4,.28);outline.bezierCurveTo(.46,.03,.12,-.35,0,-.48);
  const skin=new T.ExtrudeGeometry(outline,{depth:.085,bevelEnabled:true,bevelSegments:3,bevelSize:.015,bevelThickness:.012,curveSegments:24});skin.rotateX(-Math.PI/2);add(skin,'#c91f35');
  const flesh=new T.ShapeGeometry(outline,32);flesh.rotateX(-Math.PI/2);add(flesh,'#f44d59',0,.103,0,.88,1,.88);
  ball('#ffd4c1',0,.108,.07,.095,.006,.25);
  for(let i=0;i<14;i++){const a=i*2.39996,r=.16+Math.sqrt(i/14)*.17;const x=Math.cos(a)*r,z=.07+Math.sin(a)*r*.8;ball('#ff9c8b',x*.7,.107,z*.7,.025,.003,.05);ball('#f8d373',x,.113,z,.009,.004,.017);}
 }else if(id==='blueberry'){
  ball('#3c4c86',0,.24,0,.42,.32,.42);for(let i=0;i<5;i++){const a=i*1.256;ball('#24283f',Math.cos(a)*.095,.553,Math.sin(a)*.095,.04,.016,.075);}
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
  const chia=id==='chia',cacao=id==='cacao',count=chia?12:cacao?7:22;for(let i=0;i<count;i++){const a=i*2.4,r=.1+Math.sqrt(i/count)*(chia||cacao?.3:.6);const g=chia?new T.SphereGeometry(1,6,4):new T.IcosahedronGeometry(1,0);const size=chia?.065:cacao?.16:.15;add(g,chia?(i%3?'#363245':'#9a9298'):cacao?(i%2?'#563427':'#765246'):(i%2?'#d49b53':'#edc477'),Math.cos(a)*r,.06+(i%4)*.07,Math.sin(a)*r,size,size*.7,size*1.1,i);}
 }
 const combined=mergeGeometries(parts,false)!;parts.forEach(p=>p.dispose());combined.computeBoundingBox();combined.translate(0,-combined.boundingBox!.min.y,0);combined.computeBoundingBox();combined.computeBoundingSphere();cache.set(id,combined);return combined;
}
