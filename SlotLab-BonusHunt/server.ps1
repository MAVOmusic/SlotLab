# Slot Lab BONUS HUNT - PowerShell HTTP Server
$port = 8001
$root = $PSScriptRoot
if (-not $root) { $root = Get-Location }

$stateFile = Join-Path $root "bonus_hunt_state_v1.json"
$spinEventFile = Join-Path $root "bonus_hunt_spin_event_v1.json"

$defaultState = @{
    startingBalance = 100
    currentBalance = 100
    currentGame = "Fire In The Hole 2"
    currentBooster = "+30p No Walls + Bonus Icon locked"
    currentBet = "£0.50"
    currentBetValue = 0.50
    baseBetValue = 0.20
    threshold = 90
    remainingToThreshold = 10
    spinsThisGame = 0
    totalSpins = 0
    totalWagered = 0
    totalBonuses = 0
    highestWinX = 0
    highestWinAmount = 0
    lastWinAmount = 0
    lastWinX = 0
    sessionProfit = 0
    gameIndex = 0
    bonusAt = 0
    spinNo = "1"
    gameName = "Fire In The Hole 2"
    featureName = "Bonus Hunt • £100 Start"
    betSize = "£0.50"
    balanceDisplay = "£100.00"
    promoNote = "🎁 5 GIFTED SUBS = 100 SPINS ON YOUR GAME CALL @ 20p"
    showPromo = $true
}

$defaultStateJson = $defaultState | ConvertTo-Json -Depth 5
[System.IO.File]::WriteAllText($stateFile, $defaultStateJson, [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText($spinEventFile, "{}", [System.Text.Encoding]::UTF8)

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".txt"  = "text/plain; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".svg"  = "image/svg+xml"
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Prefixes.Add("http://127.0.0.1:$port/")

try {
    $listener.Start()
} catch {
    Write-Host "Failed to start HttpListener on port $port : $_" -ForegroundColor Red
    pause
    exit
}

Write-Host "==========================================================" -ForegroundColor Magenta
Write-Host " Slot Lab BONUS HUNT Server (PowerShell Edition)" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Magenta
Write-Host "Overlay:    http://localhost:$port/bonus-hunt-overlay.html" -ForegroundColor Yellow
Write-Host "Vertical:   http://localhost:$port/bonus-hunt-overlay-vertical.html" -ForegroundColor Yellow
Write-Host "OBS Dock:   http://localhost:$port/bonus-hunt-dock.html" -ForegroundColor Yellow
Write-Host "Controller: http://localhost:$port/bonus-hunt-controller.html" -ForegroundColor Yellow
Write-Host "State API:  http://localhost:$port/state.json" -ForegroundColor Yellow
Write-Host "----------------------------------------------------------"
Write-Host "Keep this window open while streaming. Press Ctrl+C to stop." -ForegroundColor Green

try { Start-Process "http://localhost:$port/bonus-hunt-controller.html" } catch {}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $response.AddHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        $response.AddHeader("Pragma", "no-cache")
        $response.AddHeader("Access-Control-Allow-Origin", "*")
        $response.AddHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        $response.AddHeader("Access-Control-Allow-Headers", "Content-Type")

        if ($request.HttpMethod -eq "OPTIONS") {
            $response.StatusCode = 204
            $response.Close()
            continue
        }

        $urlPath = $request.Url.LocalPath

        if ($urlPath -eq "/state.json") {
            if ($request.HttpMethod -eq "POST") {
                $reader = New-Object System.IO.StreamReader($request.InputStream, $request.ContentEncoding)
                $body = $reader.ReadToEnd()
                [System.IO.File]::WriteAllText($stateFile, $body, [System.Text.Encoding]::UTF8)
                $bytes = [System.Text.Encoding]::UTF8.GetBytes('{"ok":true}')
                $response.ContentType = "application/json; charset=utf-8"
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
                $response.Close()
                continue
            }
            $content = if (Test-Path $stateFile) { [System.IO.File]::ReadAllText($stateFile, [System.Text.Encoding]::UTF8) } else { $defaultStateJson }
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($content)
            $response.ContentType = "application/json; charset=utf-8"
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.Close()
            continue
        }

        if ($urlPath -eq "/spin-event.json") {
            if ($request.HttpMethod -eq "POST") {
                $reader = New-Object System.IO.StreamReader($request.InputStream, $request.ContentEncoding)
                $body = $reader.ReadToEnd()
                [System.IO.File]::WriteAllText($spinEventFile, $body, [System.Text.Encoding]::UTF8)
                $bytes = [System.Text.Encoding]::UTF8.GetBytes('{"ok":true}')
                $response.ContentType = "application/json; charset=utf-8"
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
                $response.Close()
                continue
            }
            $content = if (Test-Path $spinEventFile) { [System.IO.File]::ReadAllText($spinEventFile, [System.Text.Encoding]::UTF8) } else { "{}" }
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($content)
            $response.ContentType = "application/json; charset=utf-8"
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.Close()
            continue
        }

        $relFile = if ($urlPath -eq "/") { "bonus-hunt-controller.html" } else { $urlPath.TrimStart('/') }
        $filePath = Join-Path $root $relFile

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentType = $mime
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.Close()
        } else {
            $response.StatusCode = 404
            $bytes = [System.Text.Encoding]::UTF8.GetBytes("File not found")
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.Close()
        }
    } catch {}
}
