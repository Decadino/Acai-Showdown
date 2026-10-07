type FantasyFood={id:string;name:string;category:'Fruit'|'Crunch'|'Finish'|'Drizzle';color:string;accent:string;shape:string;price:number;colors:string[];description:string};
export const FANTASY_INGREDIENTS:FantasyFood[]=[
{id:'moonberry',name:'Moonberries',category:'Fruit',color:'#806be8',accent:'#c2e7ff',shape:'orb',price:2,colors:['purple','blue'],description:'Violet berries dotted with tiny moonlit pearls.'},
{id:'starfruit-magic',name:'Star Pomelo',category:'Fruit',color:'#ffd76d',accent:'#fff5ba',shape:'star',price:3,colors:['gold'],description:'Golden five-point fruit slices from a sunny little universe.'},
{id:'nebula-melon',name:'Nebula Melon',category:'Fruit',color:'#ec7db8',accent:'#88d6e8',shape:'slice',price:3,colors:['pink','blue'],description:'Pink melon coins with a bright turquoise rind.'},
{id:'aurora-kiwi',name:'Aurora Kiwi',category:'Fruit',color:'#70e1b4',accent:'#c49aff',shape:'slice',price:3,colors:['green','purple'],description:'Mint-green slices with lilac star seeds.'},
{id:'sun-peach',name:'Sunburst Peach',category:'Fruit',color:'#ffb277',accent:'#ffe99c',shape:'petal',price:2,colors:['gold','pink'],description:'Soft peach petals with a golden heart.'},
{id:'dragon-pear',name:'Dragon Pear',category:'Fruit',color:'#ad7ff0',accent:'#80e0a0',shape:'pear',price:4,colors:['purple','green'],description:'Plump purple pears topped with a tiny emerald leaf.'},
{id:'cosmic-cherry',name:'Cosmic Cherries',category:'Fruit',color:'#e5629f',accent:'#b8b2ff',shape:'cherries',price:3,colors:['pink','purple'],description:'Twin raspberry-pink cherries joined by a lilac stem.'},
{id:'cloud-grape',name:'Cloud Grapes',category:'Fruit',color:'#9ad7f3',accent:'#ece2ff',shape:'cluster',price:2,colors:['blue','white'],description:'A pillowy little cluster of sky-blue grapes.'},
{id:'meteor-crunch',name:'Meteor Crunch',category:'Crunch',color:'#9b715b',accent:'#f5c474',shape:'crumbs',price:1,colors:['brown','gold'],description:'Crunchy cocoa meteorites with golden flecks.'},
{id:'starflake',name:'Starflakes',category:'Crunch',color:'#f7d987',accent:'#fff1c3',shape:'star',price:1,colors:['gold'],description:'Tiny crisp stars for a celestial crunch.'},
{id:'rainbow-loop',name:'Rainbow Loops',category:'Crunch',color:'#e793cd',accent:'#82d6c3',shape:'loop',price:2,colors:['pink','green'],description:'Candy-pink cereal rings with mint confetti.'},
{id:'crystal-candy',name:'Crystal Candy',category:'Crunch',color:'#8ee3ed',accent:'#cfb3ff',shape:'crystal',price:3,colors:['blue','purple'],description:'Faceted aqua gems with a lavender center.'},
{id:'pop-rock',name:'Pixie Pop Rocks',category:'Crunch',color:'#ed94bc',accent:'#ffe789',shape:'crumbs',price:2,colors:['pink','gold'],description:'Bright candy pebbles, scattered like edible confetti.'},
{id:'comet-crumble',name:'Comet Crumble',category:'Crunch',color:'#f2bb70',accent:'#cc86c4',shape:'crumbs',price:1,colors:['gold','purple'],description:'Golden clusters with a splash of berry dust.'},
{id:'cinnamon-spiral',name:'Cinnamon Spirals',category:'Crunch',color:'#c48757',accent:'#f7d7a2',shape:'spiral',price:2,colors:['brown','gold'],description:'Little buttery spirals with cinnamon-colored edges.'},
{id:'moon-cookie',name:'Crescent Cookies',category:'Crunch',color:'#eac987',accent:'#f6e2b5',shape:'crescent',price:2,colors:['gold'],description:'Moon-shaped biscuits with tiny sugar pearls.'},
{id:'cloud-puff',name:'Cloud Puffs',category:'Finish',color:'#fff4ef',accent:'#eab5e6',shape:'cloud',price:2,colors:['white','pink'],description:'Fluffy cream clouds with a pale berry blush.'},
{id:'unicorn-pearl',name:'Unicorn Pearls',category:'Finish',color:'#e4b9ed',accent:'#a0e4df',shape:'pearls',price:3,colors:['purple','green'],description:'Pastel pearls in lavender, mint, and peach.'},
{id:'galaxy-star',name:'Galaxy Stars',category:'Finish',color:'#a283e8',accent:'#f5d68a',shape:'star',price:3,colors:['purple','gold'],description:'Purple sugar stars with a golden center.'},
{id:'fairy-bloom',name:'Fairy Blooms',category:'Finish',color:'#f29ecb',accent:'#9ac9f6',shape:'bloom',price:4,colors:['pink','blue'],description:'Two-tone blossoms from an imaginary sugar garden.'},
{id:'jelly-planet',name:'Jelly Planets',category:'Finish',color:'#8edcc8',accent:'#f5b5d1',shape:'planet',price:4,colors:['green','pink'],description:'Mint jelly planets wrapped in soft pink rings.'},
{id:'mermaid-scale',name:'Mermaid Scales',category:'Finish',color:'#87cee1',accent:'#a99fe5',shape:'scales',price:3,colors:['blue','purple'],description:'Overlapping sea-glass scales with lilac edges.'},
{id:'phoenix-feather',name:'Phoenix Feathers',category:'Finish',color:'#f7b369',accent:'#ee7fa7',shape:'feather',price:3,colors:['gold','pink'],description:'Curved sugar feathers in sunset colors.'},
{id:'mallow-heart',name:'Marshmallow Hearts',category:'Finish',color:'#ffb4ce',accent:'#fff0df',shape:'heart',price:2,colors:['pink','white'],description:'Pillowy strawberry hearts with a cream center.'},
{id:'stardust-syrup',name:'Stardust Syrup',category:'Drizzle',color:'#d8b76b',accent:'#fff0be',shape:'drizzle',price:3,colors:['gold'],description:'A warm gold ribbon for an enchanted finish.'},
{id:'aurora-ribbon',name:'Aurora Ribbon',category:'Drizzle',color:'#71cdb5',accent:'#d5fff1',shape:'drizzle',price:3,colors:['green'],description:'A silky mint ribbon inspired by the northern lights.'},
{id:'nebula-caramel',name:'Nebula Caramel',category:'Drizzle',color:'#a67ad5',accent:'#ecceff',shape:'drizzle',price:4,colors:['purple'],description:'Velvety violet caramel for cosmic creations.'},
{id:'dragonfire-glaze',name:'Dragonfire Glaze',category:'Drizzle',color:'#f19758',accent:'#ffe19b',shape:'drizzle',price:3,colors:['gold'],description:'A bright sunset-orange glaze with a golden shine.'},
{id:'bubblegum-glaze',name:'Bubblegum Glaze',category:'Drizzle',color:'#ec88bd',accent:'#ffd7ed',shape:'drizzle',price:3,colors:['pink'],description:'A playful candy-pink swirl.'},
{id:'moon-milk',name:'Moon Milk',category:'Drizzle',color:'#d9edf5',accent:'#ffffff',shape:'drizzle',price:2,colors:['white','blue'],description:'A pale blue cream ribbon, smooth as moonlight.'}
];
export const FANTASY_BY_ID:Record<string,FantasyFood>=Object.fromEntries(FANTASY_INGREDIENTS.map(v=>[v.id,v]));
export const SAUCE_COLORS:Record<string,string>={honey:'#e5a632',cocoa:'#4b2313',peanut:'#c28b52',vanilla:'#fff1d1',...Object.fromEntries(FANTASY_INGREDIENTS.filter(v=>v.category==='Drizzle').map(v=>[v.id,v.color]))};
export const isSauce=(id:string)=>Object.hasOwn(SAUCE_COLORS,id);
