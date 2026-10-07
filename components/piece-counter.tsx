"use client";
import {useEffect,useRef,useState} from 'react';
import {useSettings} from './settings';

export function PieceCounter({count,max}:{count:number;max:number}){
 const {preferences}=useSettings();
 const [display,setDisplay]=useState(count),[pulse,setPulse]=useState(0);
 const shown=useRef(count),previous=useRef(count);
 useEffect(()=>{
  const changed=previous.current!==count;previous.current=count;
  if(!preferences.motion){shown.current=count;setDisplay(count);return;}
  if(changed)setPulse(p=>p+1);
  const from=shown.current;if(from===count)return;
  const start=performance.now();let frame=0;
  const tick=(now:number)=>{const t=Math.min(1,(now-start)/480),ease=1-Math.pow(1-t,3);shown.current=from+(count-from)*ease;setDisplay(Math.round(shown.current));if(t<1)frame=requestAnimationFrame(tick);else shown.current=count;};
  frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);
 },[count,preferences.motion]);
 return <span className="piece-counter"><span className="sr-only" role="status">{count} of {max} pieces</span><span aria-hidden="true"><span key={pulse} className={`piece-count-value ${pulse&&preferences.motion?'piece-count-pulse':''}`}>{display}</span>/{max} pieces</span></span>;
}
