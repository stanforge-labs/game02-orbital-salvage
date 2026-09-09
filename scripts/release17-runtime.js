module.exports=l=>{
 let [init,play,ui]=l.events.map(e=>e.inlineCode.join('\n'));
 init+='\nruntimeScene.__start17=reset;';
 init=init.replaceAll('px Arial','px Exo17');
 init+='\nruntimeScene.__world17='+require('./release17-world').toString()+';\n('+require('./release17-systems').toString()+')(runtimeScene);';
 // Preserve stable, visible hazards; vary lane speed without altering controls.
 play=play.replace('s.phase*.115+i*.34','s.phase*(i===0?.065:i===1?.135:.11)+i*.34');
 play=play.replace('y=lane16.y+(i-1)*145','y=lane16.y+(i-1)*145+Math.sin(s.phase*.24)*35');
 play=play.replace('g13.region=closest13;g13.reveal=2.4;','g13.region=closest13;g13.visited17=g13.visited17||[];if(!g13.visited17.includes(closest13)){g13.visited17.push(closest13);g13.reveal=2.4;}');
 // Settle delivery only after this frame's pickups and chain stages. Persist
 // the final module-adjusted amount, not the pre-amplifier credit balance.
 const settlementStart=play.indexOf('if(Math.hypot(s.x-260,s.y-700)>230)'),settlementEnd=play.indexOf('const cam=runtimeScene.__osCam',settlementStart);
 if(settlementStart<0||settlementEnd<0)throw Error('Settlement boundary');
 const settlement=play.slice(settlementStart,settlementEnd);play=play.slice(0,settlementStart)+play.slice(settlementEnd);
 const boostStart=play.indexOf("if(v.get('GameState').getAsString()==='result'&&!s.pass10ContractBoosted"),boostEnd=play.indexOf('\n',boostStart);
 if(boostStart<0||boostEnd<0)throw Error('Contract amplifier boundary');
 const boost=play.slice(boostStart,boostEnd);play=play.slice(0,boostStart)+play.slice(boostEnd);
 play+='\n('+require('./release17-play').toString()+')(runtimeScene,dt);\nif(v.get("GameState").getAsString()==="play"){s.finalSaved17=false;'+settlement+'}\n'+boost+'\nif(v.get("GameState").getAsString()==="result"&&!s.finalSaved17){runtimeScene.__osSave();s.finalSaved17=true;}';
 ui+='\n('+require('./release17-ui').toString()+')(runtimeScene);';
 l.events[0].inlineCode=[init];l.events[1].inlineCode=[play];l.events[2].inlineCode=[ui];
};
