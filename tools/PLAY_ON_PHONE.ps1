param([switch]$NoBrowser, [string]$LanIP, [int]$Port = 4237)
$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()
$phoneProject = Split-Path -Parent $PSScriptRoot
try {
    $node = (Get-Command node -ErrorAction Stop).Source
    $config = Get-Content -Raw -LiteralPath (Join-Path $PSScriptRoot 'phone\current-build.json') | ConvertFrom-Json
    $launcher = Join-Path $phoneProject $config.launcher
    $source = Get-Content -Raw -LiteralPath $launcher
    # Read the actual PC launcher's build assignment, never copy/export elsewhere.
    $match = [regex]::Match($source, 'Join-Path\s+\$\w+\s+[''"''](exports[\\/][^''"'']+)[''"'']')
    if (-not $match.Success) { throw "Cannot resolve build from $launcher. Update tools/phone/current-build.json to the current PC launcher." }
    $build = [IO.Path]::GetFullPath((Join-Path $phoneProject $match.Groups[1].Value))
    if (-not $build.StartsWith($phoneProject + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) { throw 'Build must be inside project.' }
    if (-not (Test-Path -LiteralPath (Join-Path $build 'index.html'))) {
        Write-Host 'Browser export missing. Exporting current game.json into the PC build folder...'
        & (Join-Path $phoneProject 'scripts\export-core.ps1') -OutputDirectory $match.Groups[1].Value
        if ($LASTEXITCODE) { throw 'Export failed.' }
    }
    $choices = @(foreach ($nic in Get-NetAdapter | Where-Object { $_.Status -eq 'Up' -and $_.HardwareInterface -and $_.InterfaceDescription -notmatch 'VPN|TAP|TUN|Virtual|VMware|Hyper-V' }) {
        $cfg = Get-NetIPConfiguration -InterfaceIndex $nic.ifIndex
        if (-not $cfg.IPv4DefaultGateway) { continue }
        $metric = (Get-NetIPInterface -InterfaceIndex $nic.ifIndex -AddressFamily IPv4).InterfaceMetric
        foreach ($ip in $cfg.IPv4Address.IPAddress) {
            if ($ip -notmatch '^(127\.|169\.254\.|0\.)') {
                [pscustomobject]@{ IP=$ip; Alias=$nic.Name; Metric=$metric; Index=$nic.ifIndex }
            }
        }
    })
    $selected = $choices | Sort-Object Metric | Select-Object -First 1
    if ($LanIP) {
        $selected = $choices | Where-Object IP -eq $LanIP | Select-Object -First 1
        if (-not $selected) { throw 'Requested LAN IP is not an active physical adapter with gateway.' }
    }
    if (-not $selected) { throw 'No active Wi-Fi/Ethernet IPv4 with default gateway. Connect PC to Wi-Fi and retry.' }
    $dependency = Join-Path $PSScriptRoot 'phone\node_modules\qrcode\package.json'
    if (-not (Test-Path -LiteralPath $dependency)) {
        Write-Host 'Installing pinned local QR dependency (first launch only)...'
        & npm.cmd ci --prefix (Join-Path $PSScriptRoot 'phone') --omit=dev --ignore-scripts --no-audit --no-fund
        if ($LASTEXITCODE) { throw 'QR dependency installation failed. Check internet on first launch.' }
    }
    $category = (Get-NetConnectionProfile -InterfaceIndex $selected.Index -ErrorAction SilentlyContinue).NetworkCategory
    $arguments = @((Join-Path $PSScriptRoot 'phone\server.js'), '--root', $build, '--ip', $selected.IP, '--port', "$Port", '--interface', $selected.Alias, '--profile', "$category")
    if ($NoBrowser) { $arguments += '--no-browser' }
    & $node @arguments
    if ($LASTEXITCODE) { throw "Phone server exited with code $LASTEXITCODE" }
} catch {
    Write-Host "PHONE TEST FAILED: $_" -ForegroundColor Red
    exit 1
}
