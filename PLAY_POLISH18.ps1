$ErrorActionPreference = 'Stop'
$project18 = Split-Path -Parent $MyInvocation.MyCommand.Path
$build18 = Join-Path $project18 'exports\polish18'
if (-not (Test-Path -LiteralPath (Join-Path $build18 'index.html'))) {
    Push-Location -LiteralPath $project18
    try {
        node scripts/apply-integrated-pass10.js
        if ($LASTEXITCODE) { throw 'Project build failed' }
        & (Join-Path $project18 'scripts\export-core.ps1') -OutputDirectory 'exports\polish18'
        if ($LASTEXITCODE) { throw 'Export failed' }
    } finally { Pop-Location }
}
if (-not (Get-NetTCPConnection -LocalPort 4235 -State Listen -ErrorAction SilentlyContinue)) {
    $node18 = (Get-Command node -ErrorAction Stop).Source
    Start-Process -FilePath $node18 -WorkingDirectory $project18 -WindowStyle Hidden -ArgumentList 'scripts/local-static-server.js exports/polish18 4235'
    Start-Sleep -Seconds 2
}
Start-Process 'http://127.0.0.1:4235/'
