const {execFileSync}=require('child_process');

const run=(script)=>execFileSync(process.execPath,[script],{stdio:'inherit'});
run('scripts/release15-templates.js');
run('scripts/release14-art.js');
run('scripts/release15-art.js');
run('scripts/update-runtime-feature.js');
run('scripts/smart08-layout.js');
run('scripts/integrated-pass10-layout.js');
run('scripts/release11-layout.js');
run('scripts/release12-layout.js');
run('scripts/gameplay13-layout.js');
run('scripts/release14-layout.js');
run('scripts/release15-layout.js');
run('scripts/audit-project.js');
