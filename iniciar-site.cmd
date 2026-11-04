@echo off
setlocal
cd /d "%~dp0"
set "SITE_NODE="
where node.exe >nul 2>nul
if not errorlevel 1 set "SITE_NODE=node.exe"
if not defined SITE_NODE if exist "%ProgramFiles%\nodejs\node.exe" set "SITE_NODE=%ProgramFiles%\nodejs\node.exe"
if not defined SITE_NODE if exist "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" set "SITE_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if not defined SITE_NODE (
  echo Node.js nao encontrado. Instale o Node.js pelo site https://nodejs.org/
  pause
  exit /b 1
)
powershell -NoProfile -Command "try { $r = Invoke-WebRequest 'http://127.0.0.1:4173/app.js' -UseBasicParsing -TimeoutSec 2; if ($r.StatusCode -eq 200 -and $r.Content -match 'horizonte-public-favorites') { exit 0 } } catch {}; exit 1"
if not errorlevel 1 (
  start "" "http://127.0.0.1:4173/"
  exit /b 0
)
echo Abra http://127.0.0.1:4173/ no navegador.
echo Mantenha esta janela aberta enquanto utiliza o site.
"%SITE_NODE%" server.js
if errorlevel 1 pause
