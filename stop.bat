@echo off
setlocal enabledelayedexpansion
title IDone - Service Shutdown Utility
echo ===================================================
echo           IDone Service Shutdown Utility
echo ===================================================
echo [1/2] Terminating any process bound to port 8000 (Backend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000 " ^| findstr "LISTENING"') do (
    echo Terminating PID: %%a
    taskkill /F /PID %%a >nul 2>&1
)

echo [2/2] Terminating any process bound to port 3000 (Frontend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000 " ^| findstr "LISTENING"') do (
    echo Terminating PID: %%a
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo [DONE] IDone services on ports 8000 and 3000 have been cleanly stopped.
echo ===================================================
timeout /t 3 >nul
