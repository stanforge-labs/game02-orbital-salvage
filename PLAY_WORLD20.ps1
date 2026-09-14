$ErrorActionPreference = 'Stop'
$world20Project = Split-Path -Parent $MyInvocation.MyCommand.Path
$world20Build = Join-Path $world20Project 'exports\worldart20'
if (-not (Test-Path -LiteralPath (Join-Path $world20Build 'index.html'))) {
    Push-Location -LiteralPath $world20Project
    try {
        node scripts/apply-integrated-pass10.js
        if ($LASTEXITCODE) { throw 'Project build failed' }
        & (Join-Path $world20Project 'scripts\export-core.ps1') -OutputDirectory 'exports\worldart20'
        if ($LASTEXITCODE) { throw 'Export failed' }
    } finally { Pop-Location }
}
if (-not (Get-NetTCPConnection -LocalPort 4237 -State Listen -ErrorAction SilentlyContinue)) {
    $world20Node = (Get-Command node -ErrorAction Stop).Source
    Start-Process -FilePath $world20Node -WorkingDirectory $world20Project -WindowStyle Hidden -ArgumentList 'scripts/local-static-server.js exports/worldart20 4237'
    Start-Sleep -Seconds 2
}
Start-Process 'http://127.0.0.1:4237/'
