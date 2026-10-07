"use client";
import {lazy,Suspense,type ComponentProps} from 'react';
import {useSettings} from './settings';
import {Bowl2D} from './bowl-2d';

const Bowl3D=lazy(()=>import('./bowl-3d'));
export {IngredientImage,placePieces,sampleBowl} from './bowl-2d';
export type BowlProps=ComponentProps<typeof Bowl2D>;
export function Bowl(props:BowlProps){const {preferences}=useSettings();return <div className={`bowl-finish ${!props.small?'cafe-canvas':''} finish-${props.bowl.finish||'porcelain'} counter-${props.bowl.countertop||'studio'}`}>{<Suspense fallback={<div className="bowl-art bowl-loading"><span>Opening the 3D studio…</span></div>}><Bowl3D {...props} animatePlacements={props.animatePlacements&&preferences.motion} autoOrbit={props.autoOrbit&&preferences.rotate&&preferences.motion}/></Suspense>}</div>}
