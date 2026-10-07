@echo off
cd /d "%~dp0"
title Spin-The-Wheel Slot Lab Server
py -3 start_server.py
if errorlevel 1 python start_server.py
pause
