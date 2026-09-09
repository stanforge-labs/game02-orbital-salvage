const fs=require('fs'),crypto=require('crypto'),p=JSON.parse(fs.readFileSync('game.json')),l=p.layouts[0];
const files=['hud16','key16','energy16','radiation16',...Array.from({length:4},(_,i)=>'module16-'+i),...Array.from({length:8},(_,i)=>'wreck16-'+i),...Array.from({length:8},(_,i)=>'meteor16-'+i)];
for(const n of files){const file='assets/game/'+n+'.svg';if(!p.resources.resources.some(r=>r.file===file))p.resources.resources.push({name:file,file,kind:'image',smoothed:true,userAdded:true,metadata:''});}
const obj=n=>l.objects.find(o=>o.name===n),frames=(n,names)=>{const o=obj(n),d=o.animations[0].directions[0],base=d.sprites[0];d.sprites=names.map(n=>({...structuredClone(base),image:'assets/game/'+n+'.svg'}));d.looping=false;};
frames('HudPanel',['hud16']);frames('MissionPanel',['hud16']);frames('G13Key',['key16']);frames('ProcEnergy',['energy16']);frames('ProcPOI',files.filter(n=>n.startsWith('wreck')));frames('ProcDecor',files.filter(n=>n.startsWith('wreck')));for(const n of ['ProcHazard','MeteorStream'])frames(n,files.filter(n=>n.startsWith('meteor')));
const clone=(name,base,count)=>{if(!obj(name)){const o=structuredClone(obj(base));o.name=name;l.objects.push(o);}const inst=l.instances.find(i=>i.name===base);l.instances=l.instances.filter(i=>i.name!==name);for(let i=0;i<count;i++)l.instances.push({...structuredClone(inst),name,persistentUuid:crypto.randomUUID()});};
for(const name of ['MissionHeader16','MissionProgress16','MissionReward16','SectorName16','Radio16'])clone(name,'MissionText',1);
clone('Chaser16','MeteorStream',2);
clone('Radiation16','G13Signal',4);frames('Radiation16',['radiation16']);
frames('Module14',[...Array.from({length:11},(_,i)=>'module15-'+i),...Array.from({length:4},(_,i)=>'module16-'+i)]);
{const rows=l.instances.filter(i=>i.name==='Module14');for(let i=rows.length;i<15;i++)l.instances.push({...structuredClone(rows[0]),persistentUuid:crypto.randomUUID()});}
for(const n of ['CorridorWall']){const a=l.instances.filter(i=>i.name===n);for(let i=a.length;i<48;i++)l.instances.push({...structuredClone(a[0]),persistentUuid:crypto.randomUUID()});}
// Normal text uses a readable regular system sans; headings keep Russo One.
for(const n of ['CargoText','HullText','SectorText','SectorName16','CreditsText','MissionText','MissionProgress16','MissionReward16','Radio16','MenuDescription','ResultStats','UpgradeCardText','SectorSelectText','ResetConfirmText']){const o=obj(n);o.bold=false;o.font='Arial';o.content.bold=false;o.content.font='Arial';o.content.lineHeight=30;}
fs.writeFileSync('game.json',JSON.stringify(p,null,2)+'\n');
