@echo off
title LumièreAI India Copilot Launcher
echo ========================================================
echo       LUMIÈREAI INDIA - AI DUE DILIGENCE COPILOT
echo ========================================================
echo.

:: 1. Detect virtual environment paths (.venv or venv)
set "VENV_PATH="
if exist ".venv\Scripts\activate.bat" (
    set "VENV_PATH=.venv"
) else if exist "venv\Scripts\activate.bat" (
    set "VENV_PATH=venv"
)

if not defined VENV_PATH (
    echo [WARNING] Python virtual environment [.venv or venv] was not found at the root level.
    echo Please make sure you have created one ^(e.g., python -m venv .venv^).
    echo.
)

:: 2. Launch React Frontend
echo [1/3] Launching Frontend Development Server in a new window...
start "LumièreAI Frontend" cmd /k "cd frontend && npm run dev"

:: 3. Launch Jupyter Notebook Backend
echo [2/3] Launching Jupyter Notebook Backend in a new window...
if not "%VENV_PATH%"=="" (
    start "LumièreAI Backend (Jupyter)" cmd /k "call %VENV_PATH%\Scripts\activate && jupyter notebook"
) else (
    start "LumièreAI Backend (Jupyter)" cmd /k "jupyter notebook"
)

:: 4. Launch FastAPI Server
echo [3/3] Launching FastAPI Backend Server on Port 8000...
if not "%VENV_PATH%"=="" (
    start "LumièreAI FastAPI Server" cmd /k "call %VENV_PATH%\Scripts\activate && python -m src.main"
) else (
    start "LumièreAI FastAPI Server" cmd /k "python -m src.main"
)

echo.
echo ========================================================
echo Launch completed.
echo - Frontend: Check the new "LumièreAI Frontend" window.
echo - Notebooks: Check the new "LumièreAI Backend" window.
echo - FastAPI: Check the new "LumièreAI FastAPI Server" window.
echo ========================================================
echo.
pause
