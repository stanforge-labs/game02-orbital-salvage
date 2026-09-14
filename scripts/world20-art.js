// Original vector environment kit. Modules share materials, not silhouettes.
const fs=require('fs');
const dir='assets/game/world20';fs.mkdirSync(dir,{recursive:true});
const panel=(x,y,w,h,a=0)=>`<g transform="translate(${x} ${y}) rotate(${a})"><path d="M0 7 7 0H${w-7}L${w} 7V${h-7}L${w-7} ${h}H7L0 ${h-7}Z" fill="#233b4b" stroke="#597180" stroke-width="2"/><path d="M7 9H${w-7}M7 ${h-9}H${w-7}" stroke="#374f60" stroke-width="3"/><path d="M11 15V${h-15}M${w-11} 15V${h-15}" stroke="#182b39" stroke-width="4"/></g>`;
const solar=(x,y,w,h,a=0)=>`<g transform="translate(${x} ${y}) rotate(${a})"><path d="M0 0H${w}V${h}H0Z" fill="#1c3047" stroke="#526778" stroke-width="2"/>${Array.from({length:Math.floor(w/13)},(_,i)=>`<path d="M${i*13+6} 3V${h-3}" stroke="#354f68"/>`).join('')}${Array.from({length:Math.floor(h/16)},(_,i)=>`<path d="M3 ${i*16+8}H${w-3}" stroke="#354f68"/>`).join('')}</g>`;
const beam=(x,y,w,a=0)=>`<g transform="translate(${x} ${y}) rotate(${a})"><path d="M0 -5H${w}M0 5H${w}" stroke="#465f6d" stroke-width="3"/>${Array.from({length:Math.floor(w/15)},(_,i)=>`<path d="M${i*15} -5l15 10" stroke="#344d5c" stroke-width="2"/>`).join('')}</g>`;
const tank=(x,y,r=20)=>`<g><circle cx="${x}" cy="${y}" r="${r}" fill="#263e4c" stroke="#5a7180" stroke-width="3"/><ellipse cx="${x-3}" cy="${y-3}" rx="${r*.7}" ry="${r*.8}" fill="#324c5a"/><path d="M${x-r*.6} ${y}H${x+r*.6}" stroke="#1d303c" stroke-width="5"/></g>`;
const hull=(x,y,w,h,a=0)=>`<g transform="translate(${x} ${y}) rotate(${a})"><path d="M0 ${h*.35} ${w*.22} 0 ${w*.75} 8 ${w} ${h*.5} ${w*.73} ${h} ${w*.22} ${h*.87} 20 ${h*.55}Z" fill="#293e4e" stroke="#647580" stroke-width="2"/><path d="M${w*.23} 9 ${w*.72} 16 ${w*.9} ${h*.49} ${w*.3} ${h*.44}Z" fill="#3b5261"/><path d="M${w*.32} ${h*.53} ${w*.72} ${h*.56}M${w*.4} ${h*.66} ${w*.64} ${h*.69}" stroke="#1a2c3a" stroke-width="6"/><path d="M${w*.2} 12l8 18-10 10 12 16" fill="none" stroke="#142330" stroke-width="4"/>${Array.from({length:5},(_,i)=>`<path d="M${w*(.32+i*.075)} ${h*.17}l${w*.025} ${h*.22}" stroke="#536975" stroke-width="2"/>`).join('')}<path d="M${w*.37} ${h*.23}l${w*.32} ${h*.045}M${w*.37} ${h*.3}l${w*.32} ${h*.045}" stroke="#1a2b37" stroke-width="3"/><path d="M${w*.22} ${h*.73}l${w*.08} ${h*.06}M${w*.64} ${h*.8}l${w*.08} ${h*.045}" stroke="#667581" stroke-width="3"/><path d="M${w*.13} ${h*.42}l${w*.12} ${h*.07}m-${w*.1} ${h*.06}l${w*.1} ${h*.065}" stroke="#62737c" stroke-width="3"/></g>`;
const dish=(x,y,r=24,a=0)=>`<g transform="translate(${x} ${y}) rotate(${a})"><path d="M-${r} 0Q0 -${r*1.4} ${r} 0Q0 ${r*.7} -${r} 0Z" fill="#405560" stroke="#627984" stroke-width="2"/><path d="M0 -4V${r+14}m-8 0h16" stroke="#344d5a" stroke-width="4"/></g>`;
const ring=(x,y,r,start=20,end=315)=>{const p=a=>[x+Math.cos(a*Math.PI/180)*r,y+Math.sin(a*Math.PI/180)*r];const A=p(start),B=p(end);return `<path d="M${A}A${r} ${r} 0 ${end-start>180?1:0} 1 ${B}" fill="none" stroke="#203747" stroke-width="23"/><path d="M${A}A${r} ${r} 0 ${end-start>180?1:0} 1 ${B}" fill="none" stroke="#4b6676" stroke-width="15" stroke-dasharray="33 4"/>`;};
const scene=[
 ()=>ring(220,160,95)+beam(115,160,210)+panel(181,120,68,80)+solar(55,83,46,65)+solar(334,184,46,65,12),
 ()=>beam(70,160,305)+panel(80,110,52,100)+panel(270,95,60,122)+tank(176,159,34)+dish(228,120,32,-35),
 ()=>hull(65,100,200,100,-12)+hull(300,125,110,75,18)+beam(268,149,36,35)+panel(238,215,31,49,30),
 ()=>solar(62,70,104,58,-10)+solar(242,162,114,68,12)+beam(157,121,126,24)+panel(184,118,50,85)+dish(215,91,30),
 ()=>beam(85,180,258,-10)+[0,1,2,3].map(i=>panel(95+i*59,112-i*6,38,81,i===2?11:0)).join('')+hull(310,222,58,40,20),
 ()=>tank(164,153,54)+tank(255,153,45)+beam(135,220,181)+panel(303,112,39,86)+solar(65,117,35,112),
 ()=>ring(220,160,95,65,286)+panel(162,112,89,71)+beam(266,196,91,24)+tank(340,240,22)+panel(94,236,50,31,-23),
 ()=>hull(77,88,240,143)+tank(312,122,27)+tank(326,193,24)+panel(110,242,93,28,13),
 ()=>solar(70,86,84,140)+solar(275,89,83,140)+beam(154,153,121)+panel(193,97,47,123)+dish(215,67,24),
 ()=>beam(100,130,210)+beam(100,222,210)+[0,1,2].map(i=>tank(130+73*i,176,27)).join('')+panel(71,121,29,112)+panel(310,121,29,112),
 ()=>hull(97,94,127,73,6)+dish(290,128,49,55)+solar(253,224,93,33,-9)+beam(214,168,66,-17),
 ()=>ring(210,155,84,12,247)+solar(74,163,57,89,20)+panel(246,96,104,56,18)+tank(203,153,25),
 ()=>hull(53,177,109,54,-22)+hull(190,86,183,97,26)+solar(173,207,55,71,30),
 ()=>beam(100,102,215)+beam(100,220,215)+panel(89,80,34,162)+panel(294,80,40,162)+hull(169,125,95,52),
 ()=>dish(119,122,35,-25)+dish(303,184,42,32)+beam(156,151,111,18)+panel(193,142,45,67)+solar(82,205,63,39,15),
 ()=>ring(220,160,72,10,338)+[0,1,2].map(i=>{const a=i*120*Math.PI/180;return panel(204+Math.cos(a)*110,137+Math.sin(a)*100,34,56,i*120);}).join('')+tank(220,160,27)
];
const names=['split-habitat','repair-dock','cruiser-break','satellite-collision','cargo-spine','fuel-refinery','reactor-shell','engine-wreck','solar-farm','tank-gantry','broken-observatory','torn-ring','transport-grave','empty-drydock','relay-pair','anomaly-cage'];
const wrap=body=>`<svg xmlns="http://www.w3.org/2000/svg" width="440" height="320" viewBox="0 0 440 320"><g stroke-linejoin="round" stroke-linecap="round">${body}</g></svg>`;
const manifest={large:[],medium:[],small:[],original:true};
scene.forEach((fn,i)=>{const n='large-'+names[i];fs.writeFileSync(dir+'/'+n+'.svg',wrap(fn()));manifest.large.push(n);});
// Eight genuinely different component assemblies, three damage arrangements.
for(let i=0;i<24;i++){const v=Math.floor(i/8),k=i%8;const parts=[panel(150,105,110,84)+beam(91,150,62)+tank(294,150,25),solar(110,109,92,70)+solar(260,151,73,61,12)+beam(203,155,65),hull(120,95,187,114,v*7),tank(169,150,38)+tank(263,174,30)+beam(164,207,123),dish(210,116,52,v*15)+panel(176,173,68,57),panel(121,125,52,86)+panel(251,154,61,79,-16)+beam(174,159,63),ring(220,160,69,40+v*20,276)+panel(197,128,46,64),beam(112,123,190)+solar(128,136,49,75)+panel(240,126,57,72)][k];const n='medium-'+k+'-'+v;fs.writeFileSync(dir+'/'+n+'.svg',wrap(parts+panel(92+v*107,244-v*157,19,24,v*38)));manifest.medium.push(n);}
for(let i=0;i<30;i++){const k=i%10,v=Math.floor(i/10);const parts=[beam(130,158,170,8),solar(156,121,118,73,9),hull(137,116,144,85,0),panel(164,110,79,107,-12),dish(221,138,45,18),tank(220,154,46),beam(151,122,108,28)+beam(163,201,120,-18),panel(145,120,32,71,7)+panel(252,170,40,50,-15),solar(146,128,64,78)+panel(242,179,43,36,24),ring(220,160,60,40,215)][k];const n='small-'+k+'-'+v;fs.writeFileSync(dir+'/'+n+'.svg',wrap(`<g transform="rotate(${v*29} 220 160)">${parts}</g>`));manifest.small.push(n);}
fs.writeFileSync(dir+'/manifest.json',JSON.stringify(manifest,null,2)+'\n');
// Component sheets must not inherit the large-scene empty canvas. Crop their
// viewBox to the authored hardware so a medium assembly reads as an assembly,
// not as another tiny icon, without increasing its reserved world footprint.
for(const [list,box]of [[manifest.medium,'80 60 290 220'],[manifest.small,'105 75 230 180']])for(const name of list){const file=dir+'/'+name+'.svg';fs.writeFileSync(file,fs.readFileSync(file,'utf8').replace('viewBox="0 0 440 320"','viewBox="'+box+'"'));}
console.log('World20 original kit: 16 large, 24 medium (8 x 3), 30 small (10 x 3).');
