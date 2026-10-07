"use client";
import {roundPoints} from '@/lib/game';
import {useEffect,useState,type CSSProperties} from 'react';
import {Crown,Sparkles} from 'lucide-react';
import type {View} from '@/lib/game';
export function roundWinners(room:View){const best=Math.max(0,...room.entries.map(e=>roundPoints(room,e)));return best>0?room.entries.filter(e=>roundPoints(room,e)===best):[];}
export function Celebration({room}:{room:View}){
 const winners=roundWinners(room);const final=room.phase==='final';const top=Math.max(0,...room.players.map(p=>p.score));const overall=top>0?room.players.filter(p=>p.score===top):[];
 const won=final?overall.some(p=>p.id===room.me):winners.some(e=>e.mine);const names=final?overall.map(p=>p.name):winners.map(e=>e.name);const [burst,setBurst]=useState(true);
 useEffect(()=>{const t=setTimeout(()=>setBurst(false),4400);return()=>clearTimeout(t)},[]);
 if(!names.length)return <p className="round-winner-message">No votes were cast this round. Your next creation could be the favorite.</p>;
 return <div className={`round-celebration ${won?'you-won':''}`}><div className="round-winner-message" role="status"><Crown size={24}/><div><strong>{won?(final?'You won the showdown!':'You won this round!'):`${names.join(' & ')} ${names.length>1?'win':'wins'}${final?' the showdown!':' this round!'}`}</strong><span>{names.length>1?`A shared victory for ${names.join(' & ')}.`:final?'A very well-earned crown.':won?'Your creation earned the most votes.':'The winning creation earned the most votes.'}</span></div><Sparkles size={24}/></div>{won&&burst&&<div className="confetti-burst" aria-hidden="true">{Array.from({length:54},(_,i)=><i key={i} style={{'--x':`${(i*37)%100}%`,'--drift':`${(i%2?1:-1)*(30+i%7*18)}px`,'--turn':`${180+i*37}deg`,'--delay':`${i%9*.075}s`,background:['#9c63df','#f2b844','#e475a9','#78bd94','#78a9df'][i%5]} as CSSProperties}/>)}</div>}</div>
}
