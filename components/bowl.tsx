"use client";
import {lazy,Suspense,type ComponentProps} from 'react';
import {Bowl2D} from './bowl-2d';
const Bowl3D=lazy(()=>import('./bowl-3d'));
export {IngredientImage,placePieces} from './bowl-2d';
export type BowlProps=ComponentProps<typeof Bowl2D>;
export const sampleBowl={base:'classic',layers:['granola','classic','banana','classic','strawberry','coconut'],title:'The violet hour',pieces:Array.from({length:60},(_,i)=>{const layer= Math.floor(i/12);const id=['granola','granola','banana','banana','strawberry'][layer];const a=i*2.39996,r=12+Math.sqrt((i%12)/11)*19;return {id,layer:layer===0?0:layer===1?0:layer===2?2:layer===3?2:4,x:50+Math.cos(a)*r,y:50+Math.sin(a)*r,size:id==='granola'?14:20,rotation:i*51};}).concat(Array.from({length:14},(_,i)=>({id:'coconut',layer:5,x:50+Math.cos(i*2.4)*28,y:50+Math.sin(i*2.4)*28,size:13,rotation:i*37}))) };
export function Bowl(props:BowlProps){return <div className="bowl-finish"><Suspense fallback={<div className="bowl-art bowl-loading"><span>Preparing your cup…</span></div>}><Bowl3D {...props}/></Suspense></div>}
