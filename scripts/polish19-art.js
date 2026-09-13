// Original hardware variations; retain palette, dimensions and pooled resources.
const fs=require('fs');
const replacements=[
 [1,'M156 103v-49',`<g fill="none" stroke-linejoin="round"><path d="M139 98V43h53l-18 18h-21v37" stroke="#233d50" stroke-width="15"/><path d="M139 94V43h53l-18 18h-21" stroke="#728998" stroke-width="3"/><path d="M148 52l29 0-25 17m-9 7 10 12" stroke="#4e6576" stroke-width="4"/><path d="M184 58v25l-8 7-7-5" stroke="#7c8e99" stroke-width="4"/><path d="M127 99h40" stroke="#2b4254" stroke-width="9"/></g>`],
 [6,'M239 177v-49',`<g><path d="M221 126l41-13v64l-41 13z" fill="#263b4f" stroke="#647b89" stroke-width="2"/><path d="M228 130l26-8v10l-26 8zm0 18 26-8v10l-26 8zm0 18 26-8v10l-26 8z" fill="#152b3b" stroke="#4f687a"/><path d="M219 143l-16 6m16 15-16 6" stroke="#607883" stroke-width="5"/></g>`],
 [8,'M162 78v-49',`<g><path d="M121 32h53l14 15-16 19h-48l-12-16z" fill="#293f53" stroke="#6d8291" stroke-width="3"/><path d="M125 39h42l9 9-10 10h-38l-8-9z" fill="#172d3f"/><path d="M132 39v18m12-18v18m12-18v18" stroke="#48647a" stroke-width="4"/><path d="M146 64v26m16-26v26" stroke="#6b7e8c" stroke-width="6"/><path d="M114 47l-12-11m83 11 13-16" stroke="#526d7c" stroke-width="6"/></g>`]
];
for(const[family,start,hardware]of replacements)for(let v=0;v<2;v++){
 const file='assets/game/scenic18-'+(family*2+v)+'.svg',svg=fs.readFileSync(file,'utf8');
 const from=svg.indexOf('<g><path d="'+start),to=svg.indexOf('</g>',from)+4;
 if(from<0||to<4)throw Error('Hardware replacement anchor '+file);
 fs.writeFileSync(file,svg.slice(0,from)+hardware+svg.slice(to));
}
