$ErrorActionPreference = 'Stop'
$project19 = Split-Path -Parent $MyInvocation.MyCommand.Path
$build19 = Join-Path $project19 'exports\polish19'
if (-not (Test-Path -LiteralPath (Join-Path $build19 'index.html'))) {
    Push-Location -LiteralPath $project19
    try {
        node scripts/apply-integrated-pass10.js
        if ($LASTEXITCODE) { throw 'Project build failed' }
        & (Join-Path $project19 'scripts\export-core.ps1') -OutputDirectory 'exports\polish19'
        if ($LASTEXITCODE) { throw 'Export failed' }
    } finally { Pop-Location }
}
if (-not (Get-NetTCPConnection -LocalPort 4236 -State Listen -ErrorAction SilentlyContinue)) {
    $node19 = (Get-Command node -ErrorAction Stop).Source
    Start-Process -FilePath $node19 -WorkingDirectory $project19 -WindowStyle Hidden -ArgumentList 'scripts/local-static-server.js exports/polish19 4236'
    Start-Sleep -Seconds 2
}
Start-Process 'http://127.0.0.1:4236/'
