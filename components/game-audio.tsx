"use client";
import {useEffect,useRef} from 'react';
import {useSettings} from './settings';
import {roundPoints,type View} from '@/lib/game';
let audio:AudioContext|null=null;
export function unlockGameAudio(){if(document.documentElement.dataset.sound!=='on')return;try{audio??=new AudioContext();if(audio.state==='suspended')void audio.resume().catch(()=>{});}catch{}}
export function gameSound(kind:'drop'|'drizzle'|'slice'|'vote'|'tick'|'win'|'start'){
 if(document.documentElement.dataset.sound!=='on'||document.hidden||!audio||audio.state!=='running')return;
 const notes=kind==='win'?[523,659,784,1047]:kind==='start'?[392,523]:kind==='vote'?[660,880]:[kind==='tick'?440:kind==='drizzle'?700:kind==='slice'?950:320];
 notes.forEach((frequency,i)=>{const osc=audio!.createOscillator(),gain=audio!.createGain(),at=audio!.currentTime+i*.095;osc.type=kind==='drop'?'sine':'triangle';osc.frequency.setValueAtTime(frequency,at);if(kind==='drop'||kind==='drizzle')osc.frequency.exponentialRampToValueAtTime(frequency*.55,at+.13);gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(.045,at+.012);gain.gain.exponentialRampToValueAtTime(.0001,at+.2);osc.connect(gain);gain.connect(audio!.destination);osc.start(at);osc.stop(at+.22);osc.onended=()=>{osc.disconnect();gain.disconnect();};});
}
export function GameAudio({room,seconds,practice}:{room:View|null;seconds:number;practice:boolean}){
 const waiting=room?.phase==='build'&&room.serverNow<room.startedAt;
 const {preferences}=useSettings(),last=useRef(''),tick=useRef('');
 useEffect(()=>{if(!preferences.sound){if(audio?.state==='running')void audio.suspend().catch(()=>{});return;}const unlock=()=>unlockGameAudio();document.addEventListener('pointerdown',unlock,{passive:true});document.addEventListener('keydown',unlock);return()=>{document.removeEventListener('pointerdown',unlock);document.removeEventListener('keydown',unlock)}},[preferences.sound]);
 useEffect(()=>{const key=room?`${room.code}:${room.round}:${room.phase}:${waiting?'countdown':'live'}`:practice?'practice':'home';if(last.current&&last.current!==key){if(room?.phase==='build'&&!waiting||practice&&!room)gameSound('start');if(room&&(room.phase==='results'||room.phase==='final')){const entries=room.entries,top=Math.max(0,...entries.map(e=>roundPoints(room,e))),won=room.phase==='final'?room.players.find(p=>p.id===room.me)?.score===Math.max(...room.players.map(p=>p.score)):top>0&&entries.some(e=>e.mine&&roundPoints(room,e)===top);if(won)gameSound('win');}}last.current=key;},[room?.phase,room?.round,room?.code,practice,waiting]);
 useEffect(()=>{const key=`${last.current}:${seconds}`;if((room?.phase==='build'||room?.phase==='vote'||practice&&!room)&&seconds>0&&seconds<=5&&tick.current!==key){tick.current=key;gameSound('tick');}},[seconds,room?.phase,practice]);
 return null;
}
