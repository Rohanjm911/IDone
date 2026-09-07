@echo off
setlocal enabledelayedexpansion
title IDone — Decentralized Identity Vault
cls
color 0B

:: Resolve Workspace Root Directory
set "ROOT_DIR=%~dp0"
if "%ROOT_DIR:~-1%"=="\" set "ROOT_DIR=%ROOT_DIR:~0,-1%"

echo.
echo  ======================================================================
echo    ___ ___              
echo   |_ _|   \ ___ _ _  ___ 
echo    | || |) / _ \ ' \/ -_)
echo   |___|___/\___/_||_\___|
echo.
echo   Decentralized Identity Vault ^& Verifiable Credential Platform
echo   "Your Identity. Your Credentials. Your Control."
echo  ======================================================================
echo.

:: -------------------------------------------------------------------------
:: 1. Check Python Environment
:: -------------------------------------------------------------------------
echo  [*] Checking environment prerequisites...

set "PYTHON_EXEC="
if exist "%ROOT_DIR%\backend\venv\Scripts\python.exe" (
    set "PYTHON_EXEC=%ROOT_DIR%\backend\venv\Scripts\python.exe"
) else if exist "%ROOT_DIR%\.venv\Scripts\python.exe" (
    set "PYTHON_EXEC=%ROOT_DIR%\.venv\Scripts\python.exe"
) else if exist "%ROOT_DIR%\venv\Scripts\python.exe" (
    set "PYTHON_EXEC=%ROOT_DIR%\venv\Scripts\python.exe"
) else (
    where python >nul 2>&1
    if !errorlevel! equ 0 (
        set "PYTHON_EXEC=python"
    )
)

if "%PYTHON_EXEC%"=="" (
    echo.
    echo  [ERROR] Python was not found on your system!
    echo  Please install Python 3.10 or newer from: https://www.python.org/
    echo  Make sure to check "Add Python to PATH" during installation.
    echo.
    pause
    exit /b 1
)

:: -------------------------------------------------------------------------
:: 2. Check Node.js and npm Environment
:: -------------------------------------------------------------------------
where node >nul 2>&1
if !errorlevel! neq 0 (
    echo.
    echo  [ERROR] Node.js was not found on your system!
    echo  Please install Node.js 18+ (LTS) from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

where npm >nul 2>&1
if !errorlevel! neq 0 (
    echo.
    echo  [ERROR] npm was not found on your system!
    echo  Please ensure npm is installed and accessible in PATH.
    echo.
    pause
    exit /b 1
)

echo  [+] Python and Node.js detected.

:: -------------------------------------------------------------------------
:: 3. Check Configuration (.env)
:: -------------------------------------------------------------------------
if not exist "%ROOT_DIR%\.env" (
    if exist "%ROOT_DIR%\.env.example" (
        copy "%ROOT_DIR%\.env.example" "%ROOT_DIR%\.env" >nul
        echo  [+] Created default .env from .env.example
    )
)

:: -------------------------------------------------------------------------
:: 4. Verify Backend Dependencies
:: -------------------------------------------------------------------------
"%PYTHON_EXEC%" -c "import fastapi, uvicorn, sqlalchemy, cryptography" >nul 2>&1
if !errorlevel! neq 0 (
    echo  [*] Installing required backend packages (one-time setup)...
    "%PYTHON_EXEC%" -m pip install -r "%ROOT_DIR%\backend\requirements.txt"
    if !errorlevel! neq 0 (
        echo.
        echo  [WARNING] Failed to install backend dependencies automatically.
        echo  You may need to run: pip install -r backend\requirements.txt
    )
)

:: -------------------------------------------------------------------------
:: 5. Verify Frontend Dependencies
:: -------------------------------------------------------------------------
if not exist "%ROOT_DIR%\frontend\node_modules" (
    echo  [*] Installing frontend packages (one-time setup)...
    pushd "%ROOT_DIR%\frontend"
    call npm install
    popd
)

:: -------------------------------------------------------------------------
:: 6. Launch Backend Service (Port 8000)
:: -------------------------------------------------------------------------
:START_SERVICES
set PORT8000_RUNNING=0
netstat -ano | findstr ":8000" | findstr "LISTENING" >nul 2>&1 && set PORT8000_RUNNING=1

if "!PORT8000_RUNNING!"=="0" (
    echo  [*] Starting IDone Backend API on http://127.0.0.1:8000 ...
    start "IDone - Backend API (Port 8000)" cmd /k "title IDone - Backend API (Port 8000) && cd /d "%ROOT_DIR%\backend" && "%PYTHON_EXEC%" -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"
) else (
    echo  [+] Backend API is already active on http://127.0.0.1:8000
)

:: -------------------------------------------------------------------------
:: 7. Launch Frontend Service (Port 3000)
:: -------------------------------------------------------------------------
set PORT3000_RUNNING=0
netstat -ano | findstr ":3000" | findstr "LISTENING" >nul 2>&1 && set PORT3000_RUNNING=1

if "!PORT3000_RUNNING!"=="0" (
    echo  [*] Starting IDone Frontend UI on http://localhost:3000 ...
    start "IDone - Frontend UI (Port 3000)" cmd /k "title IDone - Frontend UI (Port 3000) && cd /d "%ROOT_DIR%\frontend" && npm run dev"
) else (
    echo  [+] Frontend UI is already active on http://localhost:3000
)

:: -------------------------------------------------------------------------
:: 8. Wait for Initialization & Launch Browser
:: -------------------------------------------------------------------------
if "!PORT3000_RUNNING!"=="0" (
    echo  [*] Waiting for servers to initialize (4 seconds)...
    timeout /t 4 /nobreak >nul
)

echo  [*] Opening IDone Web Vault in default browser...
start http://localhost:3000

:: -------------------------------------------------------------------------
:: 9. Interactive Control Dashboard
:: -------------------------------------------------------------------------
:MENU
cls
color 0A
echo.
echo  ======================================================================
echo    ___ ___              
echo   |_ _|   \ ___ _ _  ___ 
echo    | || |) / _ \ ' \/ -_)
echo   |___|___/\___/_||_\___|
echo.
echo   Decentralized Identity Vault is running!
echo  ======================================================================
echo.
echo   ACTIVE SERVICES:
echo     * Web Vault UI:          http://localhost:3000
echo     * Backend API:           http://127.0.0.1:8000
echo     * Swagger Documentation: http://127.0.0.1:8000/docs
echo     * Health Check:          http://127.0.0.1:8000/health
echo.
echo  ======================================================================
echo   CONTROLS:
echo     [B] Open Web Vault in browser
echo     [D] Open API Documentation (Swagger)
echo     [R] Restart both servers
echo     [S] Stop all services and exit
echo     [X] Keep running and close this launcher window
echo  ======================================================================
echo.

choice /C BDRSX /N /M " Choose an action [B, D, R, S, X]: "
set "CHOICE_VAL=%errorlevel%"

if "!CHOICE_VAL!"=="1" (
    start http://localhost:3000
    goto MENU
)
if "!CHOICE_VAL!"=="2" (
    start http://127.0.0.1:8000/docs
    goto MENU
)
if "!CHOICE_VAL!"=="3" (
    echo.
    echo  [*] Restarting services...
    call :STOP_SERVICES_SILENT
    timeout /t 2 /nobreak >nul
    goto START_SERVICES
)
if "!CHOICE_VAL!"=="4" (
    call :STOP_SERVICES
    exit /b 0
)
if "!CHOICE_VAL!"=="5" (
    echo.
    echo  IDone services will continue running in their respective windows.
    echo  You can stop them at any time by running stop.bat or closing them.
    timeout /t 2 /nobreak >nul
    exit /b 0
)

goto MENU

:: -------------------------------------------------------------------------
:: Subroutine: Stop Services
:: -------------------------------------------------------------------------
:STOP_SERVICES
echo.
echo  ======================================================================
echo   Stopping IDone Services...
echo  ======================================================================
set KILLED=0

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8000" ^| findstr "LISTENING"') do (
    echo  [*] Stopping Backend process (PID: %%a)...
    taskkill /F /PID %%a >nul 2>&1
    set KILLED=1
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000" ^| findstr "LISTENING"') do (
    echo  [*] Stopping Frontend process (PID: %%a)...
    taskkill /F /PID %%a >nul 2>&1
    set KILLED=1
)

if "!KILLED!"=="1" (
    echo  [+] All IDone services have been stopped.
) else (
    echo  [*] No active IDone services found on ports 8000 or 3000.
)
echo.
pause
exit /b 0

:STOP_SERVICES_SILENT
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8000" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)
exit /b 0
