"use client";
import {lazy,Suspense,type ComponentProps} from 'react';
import {Bowl2D} from './bowl-2d';
import {useVisualMode} from './visual-mode';
const Bowl3D=lazy(()=>import('./bowl-3d'));
export {IngredientImage,placePieces,sampleBowl} from './bowl-2d';
export type BowlProps=ComponentProps<typeof Bowl2D>;
export function Bowl(props:BowlProps){const {mode}=useVisualMode();return <div className={`bowl-finish finish-${props.bowl.finish||'porcelain'}`}>{mode==='2d'?<Bowl2D {...props}/>:<Suspense fallback={<div className="bowl-art bowl-loading"><span>Opening the 3D studio…</span></div>}><Bowl3D {...props}/></Suspense>}</div>}
