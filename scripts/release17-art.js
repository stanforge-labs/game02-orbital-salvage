const fs=require('fs');
fs.writeFileSync('assets/game/atmosphere17.svg','<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="800"><defs><radialGradient id="n"><stop stop-color="#e1d6f9" stop-opacity=".28"/><stop offset=".48" stop-color="#a7bde3" stop-opacity=".14"/><stop offset="1" stop-color="#7587bc" stop-opacity="0"/></radialGradient></defs><ellipse cx="500" cy="400" rx="490" ry="390" fill="url(#n)"/></svg>');
fs.writeFileSync('assets/game/hud16.svg',fs.readFileSync('assets/game/hud16.svg','utf8').replace('fill-opacity=".96"','fill-opacity="1"'));
// Original assembled vignettes. Static, desaturated hardware with depth planes;
// never framed/glowing like the interactive loot art.
for(let i=0;i<16;i++){
 const solar=(x,y,w,h)=>`<g><path d="M${x} ${y}h${w}v${h}h-${w}z" fill="#193449" stroke="#406078" stroke-width="2"/>${Array.from({length:4},(_,k)=>`<path d="M${x+(k+1)*w/5} ${y+3}v${h-6}" stroke="#2c4c65"/>`).join('')}</g>`;
 const box=(x,y,w,h)=>`<path d="M${x} ${y+8}l12-8h${w-22}l10 10v${h-14}l-12 8h-${w-24}l-12-9z" fill="url(#h)" stroke="#688095" stroke-width="2"/><path d="M${x+8} ${y+14}h${w-16}m-${w-23} 7v${h-32}" stroke="#91a2ae" opacity=".45"/>`;
 const dish=(x,y)=>`<path d="M${x-22} ${y-5}q22 40 44 0q-22-17-44 0" fill="#435a6c" stroke="#7e94a3" stroke-width="2"/><path d="M${x} ${y+8}v-35m-3 37l-12 25m15-25l12 25" stroke="#8299a5" stroke-width="3"/>`;
 let a='';switch(i%8){
 case 0:a=solar(12,56,67,70)+solar(176,42,62,76)+box(99,54,53,90)+'<path d="M74 86h30m49 0h24" stroke="#83949c" stroke-width="7"/>'+dish(125,37);break;
 case 1:a=box(52,48,138,90)+dish(84,31)+solar(188,83,50,48)+box(20,143,44,23);break;
 case 2:a=box(20,53,83,64)+box(116,82,95,70)+'<path d="M93 83l35 18m-52 7l48 42m41-15l61 28" stroke="#3f5668" stroke-width="8"/>'+solar(191,23,48,40);break;
 case 3:a=solar(10,44,90,36)+solar(10,88,90,36)+solar(158,91,83,40)+box(113,50,36,100)+dish(142,33);break;
 case 4:a=box(45,62,136,67)+'<path d="M31 146L83 30m61 8l59 107m-91-94l24 79" stroke="#44596a" stroke-width="7"/>'+box(196,118,42,28);break;
 case 5:a=box(16,45,56,74)+box(92,80,54,75)+box(179,28,57,75)+'<path d="M67 115l44 33m29-48l47-23" stroke="#3e5669" stroke-width="4"/>';break;
 case 6:a=dish(45,72)+dish(128,48)+dish(204,102)+'<path d="M32 129l86-25l81 49" fill="none" stroke="#344a5d" stroke-width="6"/>';break;
 case 7:a=box(54,47,157,80)+solar(21,101,50,45)+'<path d="M74 48l21-26h78l19 26M205 60l23 17-21 30" fill="#345164" stroke="#82959d" stroke-width="2"/>';break;
 }
 if(i>=8)a=`<g transform="translate(250 0) scale(-1 1)">${a}</g>`+box(184,151,35,20);
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="256" height="192" viewBox="0 0 256 192"><defs><linearGradient id="h" x2=".2" y2="1"><stop stop-color="#60778a"/><stop offset=".35" stop-color="#374e62"/><stop offset="1" stop-color="#152d41"/></linearGradient></defs><g transform="translate(4 7)" opacity=".3">${a}</g>${a}</svg>`;
 fs.writeFileSync('assets/game/composition17-'+i+'.svg',svg);
}
