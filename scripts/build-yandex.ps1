param([string]$ArchiveName='OrbitalSalvage_Yandex_1.0.0.zip')
$ErrorActionPreference='Stop'
if ($ArchiveName -notmatch '^[A-Za-z0-9_.-]+\.zip$') { throw 'ArchiveName must be an ASCII ZIP filename' }
Push-Location (Split-Path -Parent $PSScriptRoot)
try {
  if (Test-Path (Join-Path 'release' $ArchiveName)) { throw 'Archive exists. Choose a new filename to preserve previous candidates.' }
  node scripts/release-production.js
  if ($LASTEXITCODE -ne 0) { throw 'Production extraction failed' }
  & ./scripts/export-core.ps1 -InputProject release-game.json -OutputDirectory exports/yandex-production
  node scripts/release-package-prepare.js
  if ($LASTEXITCODE -ne 0) { throw 'Production preparation failed' }
  & ./scripts/package-yandex.ps1 -ArchiveName $ArchiveName
} finally { Pop-Location }
