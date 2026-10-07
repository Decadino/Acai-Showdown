"use client";
import {FantasyIcon} from './fantasy-icon';
import {FANTASY_BY_ID,SAUCE_COLORS} from '@/lib/fantasy-ingredients';
import {fitPiece,pieceRadius} from '@/lib/bowl-bounds';
import {useId,useRef,useState,type KeyboardEvent} from 'react';
import {INGREDIENTS,type Bowl as BowlData,type Piece} from '@/lib/game';
export function IngredientImage({index}:{index:number}){const item=INGREDIENTS[index];if(item&&FANTASY_BY_ID[item.id])return <FantasyIcon id={item.id}/>;return <span className="ingredient-image" aria-hidden="true" style={{backgroundImage:'url(/images/ingredients-atlas.png)',backgroundPosition:`${(index%4)*100/3}% ${Math.floor(index/4)*100/3}%`}}/>}
const sauces=SAUCE_COLORS;
export function Bowl2D({bowl,onPlace,onSelect,onMove,selectedIndex=-1,animatePlacements=false,label='A decorated açaí bowl',small=false}:{bowl:BowlData;autoOrbit?:boolean;gesture?:'quick'|'drizzle'|'sprinkle'|'spread';drawColor?:string;onDraw?:(points:{x:number;y:number}[])=>void;interactionKey?:string;onPlace?:(x:number,y:number)=>void;onSelect?:(index:number)=>void;onMove?:(index:number,x:number,y:number)=>void;selectedIndex?:number;animatePlacements?:boolean;label?:string;small?:boolean}){
 const id=useId().replaceAll(':','');
 const root=useRef<HTMLDivElement>(null),pointer=useRef<{index:number;x:number;y:number}|null>(null);const [drag,setDrag]=useState<{index:number;x:number;y:number}|null>(null);
 const keyboard=(e:KeyboardEvent<HTMLDivElement>)=>{if(e.target===e.currentTarget&&(e.key==='Enter'||e.key===' ')){e.preventDefault();onPlace?.(50,50);}};
 const point=(clientX:number,clientY:number)=>{const rect=root.current!.getBoundingClientRect();let x=(clientX-rect.left)/rect.width*100,y=(clientY-rect.top)/rect.height*100;const d=Math.hypot(x-50,y-50);if(d>36){x=50+(x-50)*36/d;y=50+(y-50)*36/d;}return {x,y}};
 return <div ref={root} className={`bowl-art ${small?'small':''} ${bowl.gravity?`gravity-${bowl.gravity}`:''} ${onPlace?'editable':''} ${onSelect?'selecting':''} ${animatePlacements?'animate-ingredients':''}`} role={onSelect?'group':onPlace?'button':'img'} aria-label={onSelect?'Select or drag an ingredient to customize it.':onPlace?'Your bowl. Tap to place the selected ingredient. Press Enter to place at the center.':label} tabIndex={onPlace?0:undefined} onKeyDown={keyboard} onClick={onPlace?e=>{const rect=e.currentTarget.getBoundingClientRect();const x=(e.clientX-rect.left)/rect.width*100,y=(e.clientY-rect.top)/rect.height*100;if(Math.hypot(x-50,y-50)<=38)onPlace(x,y)}:undefined}>
 <img className={`bowl-base base-${bowl.base}`} src="/images/acai-bowl.png" alt="" draggable={false}/>
 <div className="food-layer">{bowl.pieces.map((p,i)=>{const item=INGREDIENTS.find(x=>x.id===p.id);if(!item)return null;const sauce=sauces[p.id];const position=drag?.index===i?drag:p;return <span key={p.uid||i} className={`food-piece ${sauce?'sauce-piece':''} ${onSelect&&selectedIndex===i?'piece-selected':''}`} style={{left:`${position.x}%`,top:`${position.y}%`,width:`${p.size}%`,height:`${p.size}%`,transform:`translate(-50%,-50%) rotate(${p.rotation}deg)`}}><span className="ingredient-motion" style={{animationDelay:`${i%5*35}ms`}}>{sauce?<svg viewBox="0 0 100 100" aria-hidden="true"><defs><filter id={`${id}-${i}`}><feDropShadow dx="0" dy="1" stdDeviation=".7" floodOpacity=".18"/></filter></defs><path className="drizzle-path" pathLength="1" d="M17 18 C95 12 92 25 21 33 S9 48 79 49 S91 64 22 65 S10 81 77 82" fill="none" stroke={sauce} strokeWidth="3.2" strokeLinecap="round" filter={`url(#${id}-${i})`}/><path className="drizzle-path" pathLength="1" d="M17 17 C95 11 92 24 21 32 S9 47 79 48 S91 63 22 64 S10 80 77 81" fill="none" stroke="white" strokeOpacity=".2" strokeWidth=".7"/></svg>:<IngredientImage index={item.sprite}/>}</span>{onSelect&&<button type="button" className="piece-handle" aria-label={`Select ${item.name} ${i+1}`} aria-pressed={selectedIndex===i} onClick={e=>{e.stopPropagation();onSelect(i)}} onPointerDown={e=>{e.stopPropagation();onSelect(i);pointer.current={index:i,x:e.clientX,y:e.clientY};e.currentTarget.setPointerCapture(e.pointerId)}} onPointerMove={e=>{if(pointer.current?.index===i&&(Math.abs(e.clientX-pointer.current.x)+Math.abs(e.clientY-pointer.current.y)>4))setDrag({index:i,...point(e.clientX,e.clientY)})}} onPointerUp={e=>{if(pointer.current?.index===i){if(Math.abs(e.clientX-pointer.current.x)+Math.abs(e.clientY-pointer.current.y)>4){const p=point(e.clientX,e.clientY);onMove?.(i,p.x,p.y);}pointer.current=null;setDrag(null);}}} onPointerCancel={()=>{pointer.current=null;setDrag(null)}}/>}</span>})}</div>
 </div>
}
export function placePieces(id:string,x:number,y:number,mode:string,size:number,existing:Piece[]=[]):Piece[]{
 const item=INGREDIENTS.find(i=>i.id===id)!,drizzle=item.category==='Drizzle',out:Piece[]=[];
 const add=(px:number,py:number,rotation:number)=>{let piece=fitPiece({id,x:px,y:py,rotation,size:drizzle?38:size});if(!drizzle&&mode!=='single'){const origin=piece;const others=[...existing,...out].filter(p=>INGREDIENTS.find(v=>v.id===p.id)?.category!=='Drizzle');let bestScore=Infinity;for(let k=0;k<33;k++){const r=k?Math.sqrt(k/32)*14:0,a=k*2.399963;const candidate=fitPiece({...origin,x:origin.x+Math.cos(a)*r,y:origin.y+Math.sin(a)*r});const score=others.reduce((sum,p)=>{const gap=(pieceRadius(p)+pieceRadius(candidate))*.72,d=Math.hypot(candidate.x-p.x,candidate.y-p.y);return sum+Math.pow(Math.max(0,gap-d),2)*4;},0)+Math.pow(Math.hypot(candidate.x-origin.x,candidate.y-origin.y),2)*.18;if(score<bestScore){bestScore=score;piece=candidate;}}}out.push(piece);};
 const gap=Math.max(7.5,pieceRadius({id,size})*1.5),angle=Math.atan2(y-50,x-50);
 if(drizzle)add(50,50,-20);
 else if(mode==='single')add(x,y,Math.random()*30-15);
 else if(mode==='arc'){const radius=Math.max(16,Math.min(28,Math.hypot(x-50,y-50)||25)),step=Math.min(.55,gap/radius);for(let i=0;i<5;i++){const a=angle+(i-2)*step;add(50+radius*Math.cos(a),50+radius*Math.sin(a),a*180/Math.PI+90);}}
 else if(mode==='row'){const direction=angle+Math.PI/2;for(let i=0;i<5;i++)add(x+(i-2)*gap*Math.cos(direction),y+(i-2)*gap*Math.sin(direction),-18+i*8);}
 else for(let i=0;i<5;i++){const a=i*2.399963,r=gap*Math.sqrt(i)*.72;add(x+Math.cos(a)*r,y+Math.sin(a)*r,i*47);}
 return out;
}
// A generous cafe bowl, plated in curved fruit bands with small finishing details.
export const sampleBowl:BowlData={base:'classic',title:'The violet hour',pieces:[
 ...[{x:31,y:31},{x:29,y:41},{x:30,y:51},{x:34,y:61},{x:41,y:68}].map((p,i)=>({id:'banana',...p,size:17,rotation:-20+i*9})),
 ...[{x:47,y:31},{x:47,y:45},{x:48,y:59}].map((p,i)=>({id:'kiwi',...p,size:17,rotation:12+i*14})),
 ...[{x:62,y:28},{x:66,y:38},{x:67,y:48},{x:64,y:58},{x:58,y:67},{x:49,y:73}].map((p,i)=>({id:'strawberry',...p,size:16,rotation:-25+i*13})),
 ...[{x:24,y:60},{x:28,y:69},{x:36,y:76},{x:46,y:78},{x:57,y:76},{x:67,y:71},{x:74,y:63}].map(p=>({id:'blueberry',...p,size:10,rotation:0})),
 ...[{x:39,y:23},{x:47,y:22},{x:54,y:23},{x:35,y:28},{x:43,y:27}].map((p,i)=>({id:'granola',...p,size:7,rotation:i*37})),
 ...[{x:37,y:37},{x:42,y:49},{x:53,y:39},{x:55,y:55},{x:37,y:57},{x:59,y:30}].map((p,i)=>({id:'coconut',...p,size:6,rotation:i*47})),
 ...[{x:73,y:40},{x:76,y:49},{x:73,y:54}].map((p,i)=>({id:'mango',...p,size:9,rotation:15+i*25})),
 {id:'flower',x:57,y:59,size:8,rotation:-12},
 {id:'honey',x:50,y:50,size:28,rotation:0,path:Array.from({length:48},(_,i)=>({x:50+22*Math.sin(i/47*Math.PI*7),y:25+i/47*49}))}
].map(fitPiece)};
