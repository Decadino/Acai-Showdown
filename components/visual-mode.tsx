"use client";
import {createContext,useContext,useEffect,useState,type ReactNode} from 'react';
import {Box,Image} from 'lucide-react';
import {Button} from '@/components/ui/button';
const Context=createContext({mode:'3d' as '2d'|'3d',setMode:(_:'2d'|'3d')=>{}});
export function VisualProvider({children}:{children:ReactNode}){const [mode,setMode]=useState<'2d'|'3d'>('3d');useEffect(()=>{if(localStorage.getItem('acai-visual-mode')==='2d')setMode('2d')},[]);const choose=(value:'2d'|'3d')=>{setMode(value);localStorage.setItem('acai-visual-mode',value)};return <Context.Provider value={{mode,setMode:choose}}>{children}</Context.Provider>}
export const useVisualMode=()=>useContext(Context);
export function VisualSwitch(){const {mode,setMode}=useVisualMode();return <div className="visual-switch" aria-label="Bowl display mode"><Button aria-pressed={mode==='3d'} onClick={()=>setMode('3d')}><Box size={16}/>3D</Button><Button aria-pressed={mode==='2d'} onClick={()=>setMode('2d')}><Image size={16}/>2D</Button></div>}
