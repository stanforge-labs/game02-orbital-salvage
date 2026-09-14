// Summarize generated QA traffic without retaining host antivirus request tokens.
const fs=require('fs');const file='docs/yandex-zip-smoke.json',r=JSON.parse(fs.readFileSync(file));
const rows=[...new Set((r.networkErrors||[]).map(s=>{
 const match=s.match(/https?:\/\/[^\s]+/);if(!match)return s;
 const u=new URL(match[0]);return s.startsWith('external request')?'external host '+u.hostname:s.split(' ')[0]+' '+u.origin+u.pathname;
}))];r.networkErrors=rows;
fs.writeFileSync(file,JSON.stringify(r,null,2));
console.log({uncaught:r.errors,traffic:rows,pass:r.pass});
