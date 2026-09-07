@echo off
setlocal enabledelayedexpansion
title Stop IDone Services
cls
color 0C

echo.
echo  ======================================================================
echo    ___ ___              
echo   |_ _|   \ ___ _ _  ___ 
echo    | || |) / _ \ ' \/ -_)
echo   |___|___/\___/_||_\___|
echo.
echo   Stopping IDone Services (Ports 8000 ^& 3000)...
echo  ======================================================================
echo.

set KILLED=0

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8000" ^| findstr "LISTENING"') do (
    echo  [*] Stopping Backend process on port 8000 (PID: %%a)...
    taskkill /F /PID %%a >nul 2>&1
    set KILLED=1
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000" ^| findstr "LISTENING"') do (
    echo  [*] Stopping Frontend process on port 3000 (PID: %%a)...
    taskkill /F /PID %%a >nul 2>&1
    set KILLED=1
)

echo.
if "!KILLED!"=="1" (
    echo  [+] IDone backend and frontend have been successfully stopped.
) else (
    echo  [*] No active IDone services detected on ports 8000 or 3000.
)
echo  ======================================================================
echo.
pause
