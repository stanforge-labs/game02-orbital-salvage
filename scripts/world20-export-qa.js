const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const game=JSON.parse(fs.readFileSync('game.json')),context={gdjs:{}};
vm.runInNewContext(fs.readFileSync('exports/worldart20/data.js','utf8'),context);
const exported=context.gdjs.projectData;let behaviors=0;
for(const l of game.layouts)for(const o of l.objects){const target=exported.layouts.find(t=>t.name===l.name).objects.find(t=>t.name===o.name);assert.ok(target);for(const b of o.behaviors||[]){const actual=target.behaviors.find(t=>t.name===b.name&&t.type===b.type);assert.ok(actual,'Behavior mismatch '+o.name+'/'+b.name);behaviors++;}}
const ship=exported.layouts[0].objects.find(o=>o.name==='Ship');assert.equal(ship.behaviors.find(b=>b.name==='Движение').type,'TopDownMovementBehavior::TopDownMovementBehavior');
const code=fs.readFileSync('exports/worldart20/code0.js','utf8');assert.ok(code.includes('lastGuide<100'));new Function(code);
const report={pass:true,behaviorsChecked:behaviors,movementBehaviorPreserved:true,exportCodeValid:true,devGuideRateHz:10};fs.writeFileSync('docs/world20-export-qa.json',JSON.stringify(report,null,2));console.log(report);
