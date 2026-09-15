process.env.YANDEX_QA_PORT='4250';
const base=require('./yandex-qa-lib'),fs=require('fs'),crypto=require('crypto');
const zip='release/OrbitalSalvage_Yandex_1.0.0_closeout_final.zip';
const sha=crypto.createHash('sha256').update(fs.readFileSync(zip)).digest('hex').toUpperCase();
if(sha!=='110E4C820112195FC7AACEFDC65A3E8CE49AA33646C64D36C99CA3040C3EE23E')throw Error('Exact ZIP mismatch');
async function open(...args){const q=await base.open(...args);q.consoleErrors=[];q.failed=[];q.p.on('console',m=>{if(m.type()==='error')q.consoleErrors.push(m.text())});q.p.on('requestfailed',r=>q.failed.push({url:r.url().split('?')[0],error:r.failure()?.errorText}));return q;}
function save(name,data){fs.writeFileSync('docs/closeout-'+name+'.json',JSON.stringify({sha,recordedAt:new Date().toISOString(),...data},null,2));}
module.exports={...base,open,save,sha};
