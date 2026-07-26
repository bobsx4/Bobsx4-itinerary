@echo off
cd /d "%~dp0"
start "" cmd /c "timeout /t 2 >nul & start http://localhost:8765"
where py >nul 2>nul
if %errorlevel%==0 (
  py -m http.server 8765
) else (
  python -m http.server 8765
)
