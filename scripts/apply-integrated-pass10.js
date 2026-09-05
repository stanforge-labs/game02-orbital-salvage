const {execFileSync}=require('child_process');

const run=(script)=>execFileSync(process.execPath,[script],{stdio:'inherit'});
run('scripts/update-runtime-feature.js');
run('scripts/smart08-layout.js');
run('scripts/integrated-pass10-layout.js');
run('scripts/audit-project.js');
