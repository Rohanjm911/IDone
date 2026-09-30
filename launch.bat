@echo off
setlocal enabledelayedexpansion
title IDone - Decentralized Identity Vault Launcher

echo ==============================================================================
echo                      IDone Decentralized Identity Vault
echo ==============================================================================
echo.

:: 1. Check Python
where python >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Python is not installed or not in PATH. Please install Python 3.10+.
    pause
    exit /b 1
)

:: 2. Check Node
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH. Please install Node.js 18+.
    pause
    exit /b 1
)

:: 3. Setup .env
if not exist ".env" (
    if exist ".env.example" (
        echo [*] Creating .env from .env.example...
        copy .env.example .env >nul
    )
)
if not exist "backend\.env" (
    if exist ".env.example" (
        copy .env.example backend\.env >nul
    )
)

:: 4. Free ports 8000 and 3000 if occupied
echo [*] Checking and freeing ports 8000 and 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000 " ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000 " ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)

:: 5. Launch Backend
echo [*] Launching FastAPI Backend on http://127.0.0.1:8000...
if exist "backend\venv\Scripts\python.exe" (
    start "IDone Backend (FastAPI)" /min cmd /c "cd /d "%~dp0backend" && venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"
) else (
    start "IDone Backend (FastAPI)" /min cmd /c "cd /d "%~dp0backend" && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"
)

:: 6. Launch Frontend
echo [*] Launching Next.js Web Vault on http://localhost:3000...
start "IDone Frontend (Next.js)" /min cmd /c "cd /d "%~dp0frontend" && npm run dev"

echo.
echo [*] Waiting for services to initialize...
timeout /t 5 >nul

:: Open browser
start http://localhost:3000

:MENU
cls
echo ==============================================================================
echo                      IDone Decentralized Identity Vault
echo ==============================================================================
echo.
echo  Backend Status:  RUNNING at http://127.0.0.1:8000
echo  Frontend Status: RUNNING at http://localhost:3000
echo.
echo  Controls:
echo   [B] - Open IDone Web Vault in default browser
echo   [D] - Open Swagger API Docs (http://127.0.0.1:8000/docs)
echo   [R] - Restart both services
echo   [S] - Stop all services cleanly and exit
echo   [X] - Exit this launcher (keep services running)
echo.
echo ==============================================================================
choice /c BDRSX /n /m "Select an option [B, D, R, S, X]: "

if errorlevel 5 goto EXIT_KEEP
if errorlevel 4 goto STOP_ALL
if errorlevel 3 goto RESTART
if errorlevel 2 goto OPEN_DOCS
if errorlevel 1 goto OPEN_BROWSER

:OPEN_BROWSER
start http://localhost:3000
goto MENU

:OPEN_DOCS
start http://127.0.0.1:8000/docs
goto MENU

:RESTART
echo [*] Stopping services...
call "%~dp0stop.bat"
timeout /t 2 >nul
goto :EOF & call "%~dp0launch.bat"

:STOP_ALL
call "%~dp0stop.bat"
exit /b 0

:EXIT_KEEP
echo Services remain active in background.
timeout /t 2 >nul
exit /b 0
