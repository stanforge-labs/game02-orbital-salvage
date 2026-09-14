$ErrorActionPreference='Stop'
Push-Location (Split-Path -Parent $PSScriptRoot)
try {
  if (Test-Path 'release/OrbitalSalvage_Yandex_1.0.0.zip') { throw 'Archive exists. Preserve/rename the previous candidate before rebuilding.' }
  node scripts/release-production.js
  if ($LASTEXITCODE -ne 0) { throw 'Production extraction failed' }
  & ./scripts/export-core.ps1 -InputProject release-game.json -OutputDirectory exports/yandex-production
  node scripts/release-package-prepare.js
  if ($LASTEXITCODE -ne 0) { throw 'Production preparation failed' }
  & ./scripts/package-yandex.ps1
} finally { Pop-Location }
