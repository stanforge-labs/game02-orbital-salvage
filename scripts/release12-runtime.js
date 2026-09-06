// Release Quality 12: presentation-only pass. Camera, steering and persistence stay untouched.
module.exports=function applyRelease12(layout){
 let [init,play,ui]=layout.events.map(event=>event.inlineCode.join('\n'));
 if(init.includes('__release12'))return;
 init+=String.raw`
if(!runtimeScene.__release12){runtimeScene.__release12=true;}
`;
 play+=String.raw`
// Production laser dressing: the beam is a visual beam with separate emitter hardware, while the existing timing and hit test remain unchanged.
if(runtimeScene.__os11&&v.get('CurrentSector').getAsNumber()===2){
 const secret12=runtimeScene.__os11.secret,beams12=runtimeScene.getObjects('LaserBeam'),emitters12=runtimeScene.getObjects('LaserEmitter');
 // The corridor is authored: suppress unrelated roaming hazards in its footprint so timing lasers remain a fair, readable challenge.
 for(const name12 of ['Debris','FastDebris'])runtimeScene.getObjects(name12).forEach(object12=>{const x12=object12.getCenterXInScene(),y12=object12.getCenterYInScene();if(secret12&&x12>5050&&x12<6150&&y12>2000&&y12<2920)object12.hide();});
 beams12.forEach((beam12,index12)=>{const phase12=(s.phase*.95+index12*.55)%2.4,active12=phase12>1.12&&phase12<1.92,warning12=phase12>0.88&&phase12<=1.12;beam12.hide(!secret12);beam12.setOpacity(!secret12?0:active12?255:warning12?170:48);beam12.setScaleY(active12?1:warning12?.78:.48);for(let side12=0;side12<2;side12++){const emitter12=emitters12[index12*2+side12];if(emitter12){emitter12.hide(!secret12);emitter12.setOpacity(!secret12?0:active12?255:warning12?210:120);emitter12.setScale(active12?1.05:warning12?.92:.8);emitter12.setAngle(active12?Math.sin(s.phase*12)*4:0);}}});
 const zone12=runtimeScene.getObjects('SecretZone')[0];if(zone12){zone12.setOpacity(secret12?130:0);zone12.setScale(secret12?1.05:1);}
}
`;
 ui+=String.raw`
// Keep the secret objective concise and off HUD panels; it reflects the current stage rather than a generic world label.
if(st==='play'&&runtimeScene.__os11&&sector===2){const label12=runtimeScene.getObjects('SecretLabel')[0],r12=runtimeScene.__os11,nearGate12=Math.hypot(s.x-5355,s.y-1065)<760;if(label12){label12.setString(!r12.key?'СИГНАЛ: НУЖЕН КЛЮЧ ДОСТУПА':!r12.portal?'КЛЮЧ ПОЛУЧЕН • ВЕРНИТЕСЬ К ШЛЮЗУ':r12.secret?'СЕКРЕТНЫЙ КОРИДОР →':'ШЛЮЗ АКТИВИРОВАН');label12.hide(r12.secret||nearGate12);}if(r12.secret)runtimeScene.getObjects('ObjectiveText').forEach(object12=>object12.hide());}
`;
 layout.events[0].inlineCode=[init];layout.events[1].inlineCode=[play];layout.events[2].inlineCode=[ui];
};
