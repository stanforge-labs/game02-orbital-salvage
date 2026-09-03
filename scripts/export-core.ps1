$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$exportPath = Join-Path $projectRoot 'exports\core-playable'

npx --yes gdexporter --in (Join-Path $projectRoot 'game.json') --out $exportPath

# gdexporter flattens project resources to the export root but, for this
# hand-authored project, keeps the source folder in sprite animation paths.
# Normalize those generated references to the flattened runtime filenames.
$dataPath = Join-Path $exportPath 'data.js'
# gdexporter on this Windows setup serializes non-ASCII JSON text through a
# CP1251-looking intermediate string. Restore UTF-8 Cyrillic before embedding
# resources; this keeps the source JSON untouched and fixes every text object.
$data = Get-Content -Raw -LiteralPath $dataPath
$cp1251 = [System.Text.Encoding]::GetEncoding(1251)
$mojibakeMarker = [string][char]0x0420
if ($data.Contains($mojibakeMarker)) {
  $data = [System.Text.Encoding]::UTF8.GetString($cp1251.GetBytes($data))
}
$data = $data.Replace('"image":"assets/game/', '"image":"')
$data = $data.Replace('"name":"assets/game/', '"name":"')

# Keep the small set of shipped visual assets self-contained in the generated
# data file. This avoids a Pixi texture-cache edge case in gdexporter's
# flattened resource layout while leaving the source files untouched.
$imageFiles = @('background_space.png', 'space_haze.png', 'station_glow.png', 'station_custom.png', 'ship_player.png', 'salvage_scrap.png', 'salvage_panel.png', 'salvage_hull.png', 'salvage_satellite.png', 'salvage_antenna.png', 'scrap_glow.png', 'rare_container.png', 'hazard_debris.png', 'hazard_fast.png', 'debris_field.png', 'danger_zone.png', 'rotate_device.png', 'vfx_fire01.png', 'ui_panel.png', 'ui_button.png', 'favicon.ico')
foreach ($imageFile in $imageFiles) {
  $sourcePath = Join-Path $projectRoot (Join-Path 'assets\game' $imageFile)
  $bytes = [System.IO.File]::ReadAllBytes($sourcePath)
  $encoded = [Convert]::ToBase64String($bytes)
  $mime = if ($imageFile.EndsWith('.svg')) { 'image/svg+xml' } elseif ($imageFile.EndsWith('.ico')) { 'image/x-icon' } else { 'image/png' }
  $data = $data.Replace(('"file":"{0}","kind":"image"' -f $imageFile), ('"file":"data:{0};base64,{1}","kind":"image"' -f $mime, $encoded))
  $data = $data.Replace(('"file":"assets/game/{0}","kind":"image"' -f $imageFile), ('"file":"data:{0};base64,{1}","kind":"image"' -f $mime, $encoded))
}
$fontPath = Join-Path $projectRoot 'assets\game\Exo2-Variable.ttf'
$fontBytes = [System.IO.File]::ReadAllBytes($fontPath)
$fontEncoded = [Convert]::ToBase64String($fontBytes)
$data = $data.Replace('"file":"assets/game/Exo2-Variable.ttf","kind":"font"', ('"file":"data:font/ttf;base64,{0}","kind":"font"' -f $fontEncoded))
$data = $data.Replace('"file":"Exo2-Variable.ttf","kind":"font"', ('"file":"data:font/ttf;base64,{0}","kind":"font"' -f $fontEncoded))
$usedResources = '[{"name":"background_space.png"},{"name":"space_haze.png"},{"name":"station_glow.png"},{"name":"station_custom.png"},{"name":"ship_player.png"},{"name":"salvage_scrap.png"},{"name":"salvage_panel.png"},{"name":"salvage_hull.png"},{"name":"salvage_satellite.png"},{"name":"salvage_antenna.png"},{"name":"scrap_glow.png"},{"name":"rare_container.png"},{"name":"hazard_debris.png"},{"name":"hazard_fast.png"},{"name":"debris_field.png"},{"name":"danger_zone.png"},{"name":"rotate_device.png"},{"name":"vfx_fire01.png"},{"name":"ui_panel.png"},{"name":"ui_button.png"},{"name":"Exo2-Variable.ttf"}]'
$data = $data.Replace('"usedResources":[{"name":"Exo2-Variable.ttf"}]', ('"usedResources":{0}' -f $usedResources))
Set-Content -LiteralPath $dataPath -Value $data -Encoding UTF8

# The browser requests this conventional root icon during static smoke tests.
Copy-Item -LiteralPath (Join-Path $projectRoot 'assets\game\favicon.ico') -Destination (Join-Path $exportPath 'favicon.ico') -Force

Write-Output "Core export ready: $exportPath"

