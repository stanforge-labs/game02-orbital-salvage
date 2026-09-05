// Authored routes. Coordinates are world units; movement speed is unchanged.
const routes = {
 width: 6200, height: 3000,
 scrap: [[720,800],[1120,980],[1750,1100],[2160,1280],[2600,600],[3220,900],[3450,1300],[4100,1120],[4300,900],[4900,1650]],
 scrap2: [[820,950],[1280,1180],[1780,1450],[2280,1120],[2780,850],[3380,1420],[3680,1800],[4140,1040],[4440,1300],[5100,2300]],
 rare: [[5150,850],[5480,2260],[4500,2500],[3920,1520]],
 rare2: [[5160,900],[5520,2300],[4620,2480],[4200,1520]],
 hazard: [[1300,850],[1680,1030],[2250,900],[2680,1180],[3040,1120],[3560,1460],[4060,1500],[4480,1020],[4730,820],[5240,1720],[3490,750],[4880,2350],[1880,1740],[4150,510],[5550,1080],[2980,2140],[5360,820],[5650,1480]],
 danger: {x:5100,y:600,radius:320},
 prices: {cargo:150,engine:180,hull:200,magnet:140,radar:160,insurance:180,shield:210,assist:170,contract:190},
 zones: [
  {x:980,y:900,name:'РАБОЧАЯ ОРБИТА',sector:1},
  {x:2180,y:1260,name:'ПОЛЕ ОБЛОМКОВ',sector:1},
  {x:3420,y:900,name:'КЛАДБИЩЕ СПУТНИКОВ',sector:1},
  {x:4460,y:1510,name:'КОНТЕЙНЕРНЫЙ СЛЕД',sector:1},
  {x:5100,y:600,name:'МЕТЕОРНЫЙ КАРМАН',sector:2},
  {x:5520,y:2200,name:'РАДИАЦИОННЫЙ ПЛЁС',sector:2},
 ],
 unlockContracts:4, unlockModules:2,
};
// A small extra separation of near/mid/far pockets, without reducing ship speed.
for(const key of ['scrap','scrap2','rare','rare2','hazard'])routes[key]=routes[key].map(([x,y])=>[Math.round(260+(x-260)*1.08),y]);
routes.danger.x=Math.round(260+(routes.danger.x-260)*1.08);
routes.zones=routes.zones.map(zone=>({...zone,x:Math.round(260+(zone.x-260)*1.08)}));
module.exports=routes;
