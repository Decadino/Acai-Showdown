// Conservative circular footprints include the entire ingredient mesh at any rotation.
const FOOTPRINT:Record<string,number>={strawberry:.54,banana:.48,mango:.60,blueberry:.44,kiwi:.49,raspberry:.45,pineapple:.67,dragonfruit:.46,granola:.90,coconut:.53,almond:.45,cacao:.59,chia:.49,pistachio:.41,chocolate:.36,flower:.52};
export function fitPiece<T extends {id:string;x:number;y:number;size:number}>(piece:T):T{
 if(['honey','cocoa','peanut','vanilla'].includes(piece.id))return {...piece,x:50,y:50};
 // 37 recipe units fit inside the edible surface, leaving clearance below the ceramic rim.
 const radius=Math.max(0,37-(FOOTPRINT[piece.id]??.95)*piece.size-0.6);
 const dx=piece.x-50,dy=piece.y-50,d=Math.hypot(dx,dy),k=d>radius?radius/d:1;
 return {...piece,x:50+dx*k,y:50+dy*k};
}
