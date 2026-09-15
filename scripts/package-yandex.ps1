param([string]$ArchiveName='OrbitalSalvage_Yandex_1.0.0.zip')
$ErrorActionPreference = 'Stop'
if ($ArchiveName -notmatch '^[A-Za-z0-9_.-]+\.zip$') { throw 'ArchiveName must be an ASCII ZIP filename' }
$projectRoot = Split-Path -Parent $PSScriptRoot
$buildRoot = Join-Path $projectRoot 'exports\yandex-production'
$releaseRoot = Join-Path $projectRoot 'release'
$zipPath = Join-Path $releaseRoot $ArchiveName
if (!(Test-Path (Join-Path $buildRoot 'index.html'))) { throw 'Production index missing' }
New-Item -ItemType Directory -Path $releaseRoot -Force | Out-Null
if (Test-Path -LiteralPath $zipPath) { throw 'Release archive already exists; preserve it and choose explicit replacement after QA.' }
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($buildRoot,$zipPath)
$hash=(Get-FileHash -LiteralPath $zipPath -Algorithm SHA256).Hash
Set-Content -LiteralPath (Join-Path $releaseRoot ($ArchiveName.Replace('.zip','_SHA256.txt'))) -Value ($hash+'  '+$ArchiveName) -Encoding ascii
$unpackRoot = Join-Path $projectRoot ('_tmp-export\yandex-zip-'+[guid]::NewGuid().ToString('N'))
[System.IO.Compression.ZipFile]::ExtractToDirectory($zipPath,$unpackRoot)
$archive=[System.IO.Compression.ZipFile]::OpenRead($zipPath)
try {
  if (!($archive.Entries | Where-Object FullName -eq 'index.html')) { throw 'No root index' }
  if ($archive.Entries | Where-Object {$_.FullName -match '[а-яА-Я\s]'}) { throw 'Invalid archive path' }
  $size=($archive.Entries | Measure-Object Length -Sum).Sum
  if ($size -gt 100MB) { throw 'Over 100MB' }
  Write-Output "ZIP: $zipPath`nSHA256: $hash`nUNPACK: $unpackRoot`nBYTES: $size"
} finally { $archive.Dispose() }
