# Slot Lab Classic Server Launcher (PowerShell)
$root = $PSScriptRoot
if (-not $root) { $root = Get-Location }
Set-Location $root

Write-Host "==========================================================" -ForegroundColor Red
Write-Host " Slot Lab Classic Launcher (Port 8000)" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Red

# 1. Try py -3
$pyLauncher = Get-Command py -ErrorAction SilentlyContinue
if ($pyLauncher) {
    Write-Host "Found Python Launcher (py). Launching start_server.py..." -ForegroundColor Green
    & py -3 start_server.py
    exit
}

# 2. Check AppData local python paths
$localPy = Get-ChildItem "$env:LOCALAPPDATA\Programs\Python\Python3*\python.exe" -ErrorAction SilentlyContinue | Select-Object -First 1
if ($localPy) {
    Write-Host "Found Python at $($localPy.FullName). Starting start_server.py..." -ForegroundColor Green
    & $localPy.FullName start_server.py
    exit
}

# 3. Check Program Files python paths
$progPy = Get-ChildItem "C:\Program Files\Python3*\python.exe", "C:\Python3*\python.exe" -ErrorAction SilentlyContinue | Select-Object -First 1
if ($progPy) {
    Write-Host "Found Python at $($progPy.FullName). Starting start_server.py..." -ForegroundColor Green
    & $progPy.FullName start_server.py
    exit
}

# 4. Check Node.js
if (Get-Command node -ErrorAction SilentlyContinue) {
    Write-Host "Found Node.js. Starting server.js..." -ForegroundColor Green
    & node server.js
    exit
}

# 5. Check python command (test if real executable or store stub)
$pyCmd = Get-Command python -ErrorAction SilentlyContinue
if ($pyCmd) {
    try {
        $testOut = & python --version 2>&1
        if ($testOut -match "Python 3") {
            Write-Host "Starting with python start_server.py..." -ForegroundColor Green
            & python start_server.py
            exit
        }
    } catch {}
}

# 6. Fallback to built-in PowerShell server (works on 100% of Windows 10/11 machines)
Write-Host "Starting built-in Windows PowerShell HTTP Server..." -ForegroundColor Yellow
& "$root\server.ps1"
