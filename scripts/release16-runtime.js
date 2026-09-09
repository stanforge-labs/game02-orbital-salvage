module.exports=l=>{
 let [init,play,ui]=l.events.map(e=>e.inlineCode.join('\n'));
 init=init.replace("const point={x:(event.clientX-rect.left)*1920/rect.width,y:(event.clientY-rect.top)*1080/rect.height};","const game=runtimeScene.getGame(),W=game.getGameResolutionWidth(),H=game.getGameResolutionHeight(),zoom=runtimeScene.getLayer('HUD').getCameraZoom();const point={x:960+((event.clientX-rect.left)/rect.width-.5)*W/zoom,y:540+((event.clientY-rect.top)/rect.height-.5)*H/zoom};");
 init=init.replace("if(id==='scanner')get('ScannerLevel').setNumber(1);","if(id==='scanner')get('ScannerLevel').setNumber(1);if(runtimeScene.__modules16[id])get(runtimeScene.__modules16[id][0]).setNumber(1);");
 init=init.replace("get('ScannerLevel').setNumber(0);get('SpentCredits')","get('ScannerLevel').setNumber(0);for(const [key]of Object.values(runtimeScene.__modules16||{}))get(key).setNumber(0);get('SpentCredits')");
 const fs=require('fs');const arcadeArt={ship:'data:image/png;base64,'+fs.readFileSync('assets/game/ship_player.png').toString('base64'),rock:'data:image/svg+xml;base64,'+fs.readFileSync('assets/game/meteor16-3.svg').toString('base64')};
 init+='\nruntimeScene.__world16='+require('./release16-world').toString()+';\nruntimeScene.__secretModel15='+require('./release16-secret-model').toString()+';\nif(!runtimeScene.__arcadeArt16)runtimeScene.__arcadeArt16='+JSON.stringify(arcadeArt)+';\n('+require('./release16-systems').toString()+')(runtimeScene);';
 const a=play.indexOf('// Only nearby physical, visibly rendered structures'),b=play.indexOf("runtimeScene.getObjects('Ship')[0].setCenterPositionInScene(s.x,s.y);",a);
 if(a<0||b<0)throw Error('Open wall boundary');play=play.slice(0,a)+"runtimeScene.getObjects('RegionWall15').forEach(o=>o.hide());\n"+play.slice(b);
 play=play.replace("kind==='scrap'?17:kind==='heavy'?29:21","kind==='scrap'?23:kind==='heavy'?32:27").replace("kind==='scrap'?16:kind==='heavy'?26:21","kind==='scrap'?21:kind==='heavy'?29:27");
 play=play.replace('o.setAngle((s.phase*16+i*29)%360)','o.setAngle((i*29)%360)');
 play=play.replace("o.setAnimationFrame(d.kind==='working'||d.kind==='relay'?0:d.kind==='graveyard'?2:1);o.setWidth(d.kind==='working'?105:190);o.setHeight(d.kind==='working'?82:126)","o.setAnimationFrame(d.frame||0);o.setWidth(d.size||160);o.setHeight((d.size||160)*.57)");
 play=play.replace("o.setAngle((i*47)%360)","o.setAngle(d.angle||0)");
 play=play.replace("o.setAnimationFrame(Math.floor(d.angle)%6)","o.setAnimationFrame(d.frame||0)");
 play=play.replace('const amp=d.moving?90:18','const amp=d.moving?65:0');
 play=play.replace('o.setAnimationFrame(i%6);o.setWidth(24+(i%3)*10);o.setHeight(24+(i%3)*10)','o.setAnimationFrame((d.family||0)%8);o.setWidth(d.size||38);o.setHeight(d.family===2?24:d.size||38)');
 play=play.replace('near13(xx,yy,21+(i%3)*5)','near13(xx,yy,(d.family===2?24:(d.size||38)/2)+12)');
 // Stable continuous lanes: wrap far outside the local crossing, not on/off blinking.
 const ms=play.indexOf('g13.meteor.clock=(g13.meteor.clock+dt)%8;'),me=play.indexOf('// Secret discovery',ms);if(ms<0||me<0)throw Error('Meteor boundary');
 play=play.slice(0,ms)+String.raw`
g13.meteor.clock=(g13.meteor.clock+dt)%12;
const lane16=g13.regions.find(r=>r.id==='meteor')||g13.regions[3];runtimeScene.getObjects('MeteorStream').forEach((o,i)=>{const t=(s.phase*.115+i*.34)%1,x=lane16.x+900-t*1800,y=lane16.y+(i-1)*145,show=i<(sec13===2?3:2)&&!(g13.secret.stage>=4&&g13.secret.stage<6)&&Math.hypot(s.x-x,s.y-y)<1350;o.hide(!show);if(!show)return;o.pauseAnimation();o.setAnimationFrame(i%8);o.setWidth(42+i%3*8);o.setHeight(36+i%3*8);o.setCenterPositionInScene(x,y);o.setAngle(220+i*13);o.setOpacity(255);if(s.inv<=0&&near13(x,y,31+i%3*4)){v.get('Hull').setNumber(Math.max(0,v.get('Hull').getAsNumber()-1));v.get('RunDamage').setNumber(v.get('RunDamage').getAsNumber()+1);v.get('Streak').setNumber(0);s.inv=.85;s.flash=.2;s.floatText='МЕТЕОР −1 КОРПУС';s.floatLife=1;}});
`+play.slice(me);
 play=play.replace('keyObj13.setScale(.95)','keyObj13.pauseAnimation();keyObj13.setWidth(44);keyObj13.setHeight(44)');
 play=play.replace("s.x=5000;s.y=2320;s.vx=0;s.vy=0;runtimeScene.__osCam={x:5000,y:2320}","s.x=4610;s.y=2170;s.vx=0;s.vy=0;runtimeScene.__osCam={x:4610,y:2170}").replace('setCenterPositionInScene(s.x,s.y);v.get(\'Status\').setString(\'СЕКРЕТНЫЙ КОРИДОР\')','setCenterPositionInScene(s.x,s.y);v.get(\'Status\').setString(\'СЕКРЕТНЫЙ КОРИДОР\')');
 play=play.replace('setWidth(76);o.setHeight(76)','setWidth(96);o.setHeight(96)');
 play=play.replace('if(p&&near13(...p,42)){secret13.progress=i+1','if(p&&near13(...p,48))secret13.scan16=(secret13.scan16||0)+dt;else secret13.scan16=0;if(p&&secret13.scan16>=1.3){secret13.scan16=0;secret13.progress=i+1');
 play=play.replaceAll('add(0,122)','add(0,158)').replaceAll('add(-23,122)','add(-23,158)').replaceAll('add(23,122','add(23,158').replaceAll('add((j-1)*27,122','add((j-1)*27,158').replace('add(0,116)','add(0,150)').replace('add(0,100','add(0,150').replace('add(Math.sin(s.phase*.8)*33,122)','add(Math.sin(s.phase*.8)*33,158)');
 play=play.replace('map15.template===3','(map15.template===3||map15.template===6)');
 // The longitudinal arm must leave a braking margin at the adjacent scan pocket.
 play=play.replace('add(0,150,!g.vertical)','add(0,110,!g.vertical)');
 play=play.replace("o.setOpacity(235);const r=16","o.setOpacity(235);o.setColor(['171;211;225','184;168;139','131;194;205','164;148;202'][map15.template%4]);const r=16");
 play=play.replace('o.setWidth(24);o.setHeight(24)','o.setWidth(38);o.setHeight(38)');
 play=play.replace("const moduleIds14=['cargo','engine','hull','magnet','radar','insurance','shield','assist','contract','repair','scanner']","const moduleIds14=['cargo','engine','hull','magnet','radar','insurance','shield','assist','contract','repair','scanner','buffer','containment','salvage','decoder']");
 play=play.replace("o.setWidth(i===4||i===6?8:6);o.setHeight(i===1?10:8)","o.setWidth(i===4||i===6?10:8);o.setHeight(i===1?12:10)");
 play+='\n('+require('./release16-play').toString()+')(runtimeScene,dt,fail);';
 ui=ui.replace('routesUi13[g13.secret.template]','routesUi13[g13.secret.template%routesUi13.length]');
 ui=ui.replace('s.x=5000;s.y=2320;s.vx=0;s.vy=0;runtimeScene.__osCam={x:s.x,y:s.y}', 's.x=4610;s.y=2170;s.vx=0;s.vy=0;runtimeScene.__osCam={x:s.x,y:s.y}');
 ui=ui.replaceAll('3 ПРЕДЛОЖЕНИЯ ИЗ 11 МОДУЛЕЙ','3 ПРЕДЛОЖЕНИЯ ИЗ 15 МОДУЛЕЙ');
 ui+='\n('+require('./release16-ui').toString()+')(runtimeScene);';
 l.events[0].inlineCode=[init];l.events[1].inlineCode=[play];l.events[2].inlineCode=[ui];
};
