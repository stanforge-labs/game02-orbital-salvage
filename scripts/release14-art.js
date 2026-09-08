// Original project-owned vector art. No external assets or image upscaling.
const fs=require('fs');
const root='assets/game/';
const wrap=(body,w=128,h=128)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;
for(let i=0;i<6;i++){
 const points=Array.from({length:9},(_,j)=>{const a=j*Math.PI*2/9,r=45+Math.sin(j*7+i*3)*9;return [64+Math.cos(a)*r,64+Math.sin(a)*r].map(x=>x.toFixed(1)).join(',');}).join(' ');
 const hot=i>=4,metal=i===3;
 fs.writeFileSync(root+`meteor14-${i}.svg`,wrap(`<polygon points="${points}" fill="${hot?'#694536':metal?'#385568':'#4f5362'}" stroke="${hot?'#ed9d64':'#95a0ac'}" stroke-width="3"/><path d="M30 45 L61 24 87 44 73 73 104 92 60 105 31 81Z" fill="${hot?'#87563c':'#68717d'}"/><path d="M31 45L73 73 60 105M61 24L73 73 104 92" fill="none" stroke="${hot?'#ffb86c':'#303a49'}" stroke-width="4"/><path d="M42 53l13 -8 9 10-7 13-13-3zM80 83l10-5 4 9-10 5z" fill="#303644" opacity=".7"/>`));
}
fs.writeFileSync(root+'bulkhead14.svg',wrap('<path d="M8 0H56L64 8V504L56 512H8L0 504V8Z" fill="#102333" stroke="#557e90" stroke-width="2"/><path d="M10 5H54V507H10Z" fill="#1d3e50" stroke="#32556b" stroke-width="2"/>'+Array.from({length:8},(_,i)=>`<path d="M14 ${i*64+12}h36v40H14Z" fill="#254a5b" stroke="#3d6577"/><path d="M18 ${i*64+20}h14m-14 6h20" stroke="#517c88"/><path d="M3 ${i*64+29}h5v8H3m53 0h5v8h-5" fill="#86bac2"/>`).join(''),64,512));
fs.writeFileSync(root+'pocket14.svg',wrap('<circle cx="64" cy="64" r="54" fill="#173e42" fill-opacity=".18" stroke="#79cdb4" stroke-opacity=".65" stroke-width="2" stroke-dasharray="13 15"/><path d="M54 64h20M64 54v20" stroke="#8ae0c2" stroke-width="3"/>'));
fs.writeFileSync(root+'dim14.svg',wrap('<path fill="#020712" d="M0 0h128v128H0z"/>'));
fs.writeFileSync(root+'module14.svg',wrap('<path d="M20 12h24l8 12v40l-8 12H20L12 64V24Z" fill="#274d60" stroke="#9ed3da" stroke-width="3"/><path d="M22 25h20v12H22z" fill="#ffc361"/><path d="M22 48h20M22 57h20" stroke="#62b9d0" stroke-width="3"/>',64,88));
console.log('8 original Release14 vector assets generated');
