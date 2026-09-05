// Authored routes. Coordinates are world units; movement speed is unchanged.
const routes = {
 width: 6200, height: 3000,
 scrap: [[720,800],[1750,1100],[2600,600],[3450,1300],[4300,900],[4900,1650],[4870,480],[5260,670]],
 scrap2: [[820,950],[1780,1450],[2780,850],[3680,1800],[4440,1300],[5100,2300],[4860,550],[5240,690]],
 rare: [[5150,850],[5480,2260],[4500,2500]],
 rare2: [[5160,900],[5520,2300],[4620,2480]],
 hazard: [[1300,850],[2250,900],[3040,1120],[4060,1500],[4730,820],[5240,1720],[3490,750],[4880,2350],[1880,1740],[4150,510],[5550,1080],[2980,2140]],
 danger: {x:5100,y:600,radius:320},
 prices: {cargo:150,engine:180,hull:200,magnet:140,radar:160,insurance:180},
 unlockContracts:4, unlockModules:2,
};
// A small extra separation of near/mid/far pockets, without reducing ship speed.
for(const key of ['scrap','scrap2','rare','rare2','hazard'])routes[key]=routes[key].map(([x,y])=>[Math.round(260+(x-260)*1.08),y]);
routes.danger.x=Math.round(260+(routes.danger.x-260)*1.08);
module.exports=routes;
