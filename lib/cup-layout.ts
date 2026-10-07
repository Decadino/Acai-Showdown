export function cupLayout(layers:string[]){
 const weight=(id:string)=>['classic','pitaya','blue'].includes(id)?.5:id==='granola'?.28:['coconut','flower'].includes(id)?.10:['honey','cocoa','peanut','vanilla'].includes(id)?.07:['banana','strawberry','kiwi','mango','blueberry','raspberry','pineapple','dragonfruit'].includes(id)?.42:.23;
 const weights=layers.map(weight),factor=layers.length*.37/weights.reduce((a,b)=>a+b,0);let bottom=-1.065;
 return layers.map((id,i)=>{const height=weights[i]*factor,top=bottom+height;const layer={id,bottom,top,height,r0:.92+(bottom+1.065)*.145,r1:.92+(top+1.065)*.145};bottom=top;return layer;});
}
