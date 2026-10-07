import {SAUCE_COLORS} from '@/lib/fantasy-ingredients';
import * as T from 'three';
import type {Piece} from '../lib/game';
import {ingredientGeometry} from './food-geometry';

// Build a round sauce ribbon from its centerline, keeping every cross-section intact.
export function drizzleGeometry(piece:Piece, toppings:Piece[], heights:number[], layer=0){
 const scale=piece.size*.048, angle=-piece.rotation*Math.PI/180;
 const points:T.Vector3[]=[];
 const samples=piece.path?.length&&piece.path.length>1?piece.path:null;
 for(let i=0;i<(samples?samples.length:161);i++){
  const t=i/160, fit=Math.min(1,1.66/(scale*.99)), x=samples?(samples[i].x-50)*.048/scale:.7*fit*Math.sin(t*Math.PI*8), z=samples?(samples[i].y-50)*.048/scale:(t-.5)*1.4*fit;
  const wx=(x*Math.cos(angle)+z*Math.sin(angle))*scale;
  const wz=(-x*Math.sin(angle)+z*Math.cos(angle))*scale;
  let height=.46+.14*Math.sqrt(Math.max(0,1-(wx*wx+wz*wz)/3.276));
  toppings.forEach((p,j)=>{
   const radius=p.size*.048*.55, d=Math.hypot(wx-(p.x-50)*.048,wz-(p.y-50)*.048);
   const geometry=ingredientGeometry(p.id);if(!geometry.boundingBox)geometry.computeBoundingBox();const top=heights[j]+p.size*.048*(geometry.boundingBox?.max.y??.38);
   height=Math.max(height,height+(top-height)*Math.exp(-2*d*d/(radius*radius)));
  });
  points.push(new T.Vector3(x,(height+.028+Math.min(layer,12)*.004-.61)/scale,z));
 }
 const g=new T.TubeGeometry(new T.CatmullRomCurve3(points,false,'centripetal'),240,.018,8,false);
 const color=new T.Color(SAUCE_COLORS[piece.id]||'#e5a632');
 const colors=new Float32Array(g.getAttribute('position').count*3);
 for(let i=0;i<colors.length;i+=3){colors[i]=color.r;colors[i+1]=color.g;colors[i+2]=color.b;}
 g.setAttribute('color',new T.BufferAttribute(colors,3));g.computeBoundingSphere();return g;
}
