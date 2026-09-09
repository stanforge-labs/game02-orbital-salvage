$ErrorActionPreference = 'Stop'
$project17 = Split-Path -Parent $MyInvocation.MyCommand.Path
$build17 = Join-Path $project17 'exports\release17'
if (-not (Test-Path -LiteralPath (Join-Path $build17 'index.html'))) {
    Push-Location -LiteralPath $project17
    try {
        node scripts/apply-integrated-pass10.js
        & (Join-Path $project17 'scripts\export-core.ps1') -OutputDirectory 'exports\release17'
    } finally { Pop-Location }
}
if (-not (Get-NetTCPConnection -LocalPort 4234 -State Listen -ErrorAction SilentlyContinue)) {
    $node17 = (Get-Command node -ErrorAction Stop).Source
    Start-Process -FilePath $node17 -WorkingDirectory $project17 -WindowStyle Hidden -ArgumentList 'scripts/local-static-server.js exports/release17 4234'
    Start-Sleep -Seconds 2
}
Start-Process 'http://127.0.0.1:4234/'
