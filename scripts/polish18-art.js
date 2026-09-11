// Original vector environment art. All colours and silhouettes belong to the
// existing cold industrial palette; decoration has no collectible outline.
const fs=require('fs');
const panel=(x,y,w,h)=>`<g><path d="M${x} ${y}h${w}v${h}h-${w}z" fill="url(#solar)" stroke="#51687c" stroke-width="2"/>${Array.from({length:5},(_,j)=>`<path d="M${x+(j+1)*w/6} ${y+3}v${h-6}" stroke="#536681" opacity=".65"/>`).join('')}<path d="M${x+3} ${y+h/2}h${w-6}" stroke="#60718c" opacity=".5"/></g>`;
const body=(x,y,w,h)=>`<g><path d="M${x+9} ${y}h${w-18}l9 12v${h-21}l-12 9h-${w-23}l-11-12v-${h-25}z" fill="url(#metal)" stroke="#7c8e9c" stroke-width="2"/><path d="M${x+9} ${y+7}h${w-24}l8 8m-${w-16} 1v${h-34}" fill="none" stroke="#b1b8bb" opacity=".4"/><path d="M${x+5} ${y+h-17}h${w-10}" stroke="#182d3c" stroke-width="5"/><path d="M${x+w*.67} ${y+7}l-5 17 8 11-6 20" fill="none" stroke="#152938" stroke-width="3"/>${[18,w-19].map(dx=>`<circle cx="${x+dx}" cy="${y+17}" r="2" fill="#b4a07a"/>`).join('')}</g>`;
const antenna=(x,y)=>`<g><path d="M${x} ${y+32}v-49m-15 49l15-22 17 22" stroke="#748b99" stroke-width="4" fill="none"/><path d="M${x-28} ${y-14}Q${x} ${y+35} ${x+28} ${y-14}Q${x} ${y-26} ${x-28} ${y-14}Z" fill="#506675" stroke="#899da5" stroke-width="2"/><path d="M${x-24} ${y-12}l24 23 22-22" stroke="#293f50" fill="none"/></g>`;
const truss=(x,y,w)=>`<path d="M${x} ${y}h${w}m-${w} 12h${w}" stroke="#5c7280" stroke-width="4"/><path d="M${x} ${y}l20 12 20-12 20 12 20-12 20 12 20-12" stroke="#344c60" stroke-width="3" fill="none"/>`;
const rock=(x,y,r)=>`<path d="M${x-r} ${y-3}l${r*.45}-${r*.8} ${r} -${r*.2} ${r*.65} ${r*.9}-${r*.35} ${r*.85}-${r} ${r*.3}-${r*.75}-${r*.7}z" fill="#424957" stroke="#657080" stroke-width="2"/><path d="M${x-r*.55} ${y-r*.4}l${r*.65} ${r*.2} ${r*.65} ${r*.7}m-${r*.7}-${r*.8}l-${r*.2} ${r}" stroke="#252f3e" stroke-width="3" fill="none"/>`;
for(let theme=0;theme<12;theme++)for(let variant=0;variant<2;variant++){
 let a='';switch(theme){
 case 0:a=panel(24,60,79,100)+panel(195,53,79,100)+body(121,64,54,99)+truss(91,101,121)+antenna(147,51);break;
 case 1:a=truss(42,79,215)+body(56,104,94,71)+body(174,109,71,69)+antenna(156,71)+'<path d="M47 67v91m200-94v90" stroke="#657986" stroke-width="11"/>';break;
 case 2:a=body(43,54,95,119)+`<g transform="rotate(23 205 123)">${body(160,85,94,76)}</g>`+panel(193,30,58,40)+'<path d="M133 84l28 26-19 17 25 21m-43 16l39 16" stroke="#526879" stroke-width="5" fill="none"/>';break;
 case 3:a=panel(22,45,89,51)+panel(23,112,89,49)+body(123,66,57,120)+panel(192,117,91,47)+antenna(164,49)+'<path d="M181 92l23-14 23 11" stroke="#627483" fill="none" stroke-width="5"/>';break;
 case 4:a=rock(107,111,56)+rock(202,147,32)+rock(219,59,22)+'<path d="M20 69l52 13m-60 31l53 7m167 66l48 14" stroke="#596171" stroke-width="3" opacity=".5"/>';break;
 case 5:a=truss(39,118,219)+body(43,46,54,83)+body(121,58,56,83)+body(201,92,53,83)+'<path d="M36 135q80 70 169 32" stroke="#6b737a" fill="none" stroke-width="2" stroke-dasharray="8 9"/>';break;
 case 6:a=body(75,69,144,81)+antenna(239,145)+'<g fill="none"><ellipse cx="148" cy="105" rx="51" ry="20" stroke="#947796" stroke-width="9"/><ellipse cx="148" cy="105" rx="40" ry="13" stroke="#393c57" stroke-width="8"/><path d="M64 89l-28-22m39 74l-25 22m175-76l28-21" stroke="#75838e" stroke-width="8"/></g>';break;
 case 7:a=body(27,81,120,69)+body(170,65,89,90)+'<path d="M144 87l19-23-9 38 17 5-24 21 16 27" stroke="#899399" stroke-width="4" fill="none"/>'+panel(76,165,72,28);break;
 case 8:a='<path d="M61 89a90 76 0 0 1 155-31m23 44a90 76 0 0 1-136 74" fill="none" stroke="#344d60" stroke-width="32"/><path d="M64 89a87 73 0 0 1 150-28m22 42a87 73 0 0 1-130 70" fill="none" stroke="#778997" stroke-width="4"/>'+body(113,93,58,61)+antenna(162,46);break;
 case 9:a=body(66,117,153,55)+antenna(81,85)+antenna(178,71)+'<path d="M70 121l54-46 82 44" stroke="#657685" fill="none" stroke-width="5"/><ellipse cx="143" cy="116" rx="17" ry="8" fill="#516887"/>';break;
 case 10:a=rock(93,111,42)+rock(174,78,34)+rock(221,146,29)+'<path d="M61 107l28-28 13 51m45-53l20-23 12 39m27 48l15-18 5 29" stroke="#839caa" opacity=".65" fill="none" stroke-width="4"/>';break;
 case 11:a=body(117,90,66,91)+antenna(66,90)+antenna(223,76)+truss(86,147,118)+panel(111,28,75,34);break;
 }
 const chips=variant?body(231,185,29,17)+panel(36,177,34,21):'<path d="M25 187l22 6m215-148l10 7" stroke="#657889" stroke-width="4"/>';
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="300" height="225" viewBox="0 0 300 225"><defs><linearGradient id="metal" x2=".25" y2="1"><stop stop-color="#7a8b98"/><stop offset=".23" stop-color="#536b7e"/><stop offset=".3" stop-color="#334b60"/><stop offset="1" stop-color="#203748"/></linearGradient><linearGradient id="solar" x2="1" y2="1"><stop stop-color="#384665"/><stop offset="1" stop-color="#172d42"/></linearGradient></defs><g transform="${variant?'translate(300 0) scale(-1 1)':'translate(0 0)'}">${a}${chips}</g></svg>`;
 fs.writeFileSync('assets/game/scenic18-'+(theme*2+variant)+'.svg',svg);
}
// Quiet floor assemblies sit UNDER the safe-pocket ring, ship and laser beams.
// The central 90px lane is intentionally empty; machinery is on the margins.
for(let i=0;i<6;i++){
 const accents=['#648c9a','#928773','#727f9e','#688d85','#8e7899','#8593a3'];let hardware='';
 for(const[x,y]of[[15,16],[145,16],[15,145],[145,145]])hardware+=`<rect x="${x}" y="${y}" width="39" height="38" rx="4" fill="#263c50" stroke="${accents[i]}"/><path d="M${x+6} ${y+10}h25m-25 7h25m-25 7h17" stroke="#637382" opacity=".7"/>`;
 let mark=i===0?'<path d="M62 25h76m-76 150h76" stroke-dasharray="8 6"/>':i===1?'<path d="M22 62v76m156-76v76" stroke-width="7"/>':i===2?'<path d="M67 23l10 14m46 0l10-14M67 177l10-14m46 0l10 14"/>':i===3?'<path d="M22 63l13 12-13 12m156 26l-13 12 13 12"/>':i===4?'<path d="M70 21h60m-60 8h60m-60 142h60m-60 8h60"/>':'<path d="M72 21h56l-8 12H80zM72 179h56l-8-12H80z"/>';
 fs.writeFileSync('assets/game/secret-scene18-'+i+'.svg',`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><path d="M10 20L20 10h160l10 10v160l-10 10H20l-10-10z" fill="#102436" fill-opacity=".56" stroke="#34495c"/><path d="M55 14v172m90-172v172M14 55h172M14 145h172" stroke="#34485b" stroke-opacity=".6"/>${hardware}<g fill="none" stroke="${accents[i]}" stroke-width="3" opacity=".8">${mark}</g></svg>`);
}
