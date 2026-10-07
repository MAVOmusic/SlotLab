@echo off
cd /d "%~dp0"
title Slot Lab Bonus Hunt Server (Port 8001)

echo ==========================================================
echo  Starting Slot Lab BONUS HUNT on http://localhost:8001/
echo ==========================================================

:: 1. Try Python Launcher py -3
py -3 start_server.py 2>nul
if %errorlevel% equ 0 goto :done

:: 2. Try py without -3
py start_server.py 2>nul
if %errorlevel% equ 0 goto :done

:: 3. Search common Python install locations directly
if exist "%LocalAppData%\Programs\Python\Python313\python.exe" ( "%LocalAppData%\Programs\Python\Python313\python.exe" start_server.py & goto :done )
if exist "%LocalAppData%\Programs\Python\Python312\python.exe" ( "%LocalAppData%\Programs\Python\Python312\python.exe" start_server.py & goto :done )
if exist "%LocalAppData%\Programs\Python\Python311\python.exe" ( "%LocalAppData%\Programs\Python\Python311\python.exe" start_server.py & goto :done )
if exist "%LocalAppData%\Programs\Python\Python310\python.exe" ( "%LocalAppData%\Programs\Python\Python310\python.exe" start_server.py & goto :done )
if exist "%LocalAppData%\Programs\Python\Python39\python.exe"  ( "%LocalAppData%\Programs\Python\Python39\python.exe" start_server.py & goto :done )
if exist "C:\Program Files\Python312\python.exe" ( "C:\Program Files\Python312\python.exe" start_server.py & goto :done )
if exist "C:\Program Files\Python311\python.exe" ( "C:\Program Files\Python311\python.exe" start_server.py & goto :done )
if exist "C:\Program Files\Python310\python.exe" ( "C:\Program Files\Python310\python.exe" start_server.py & goto :done )
if exist "C:\Python312\python.exe" ( "C:\Python312\python.exe" start_server.py & goto :done )
if exist "C:\Python311\python.exe" ( "C:\Python311\python.exe" start_server.py & goto :done )

:: 4. Try Node.js server fallback
where node >nul 2>nul
if %errorlevel% equ 0 (
    echo Python not found in system PATH. Starting with Node.js server...
    node server.js
    goto :done
)

:: 5. Native PowerShell HTTP Server fallback (built into every Windows 10/11)
echo Python not found in system PATH. Launching built-in PowerShell server...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1"
if %errorlevel% equ 0 goto :done

:: 6. Direct python attempt
python start_server.py

:done
pause
