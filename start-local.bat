@echo off
setlocal
cd /d "%~dp0"

set "CODEX_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"

if exist "%CODEX_NODE%" (
  set "NODE_EXE=%CODEX_NODE%"
) else (
  set "NODE_EXE=node"
)

echo Starting AI Li Wenya local server...
echo URL: http://127.0.0.1:8787
echo.

start "" "http://127.0.0.1:8787"
"%NODE_EXE%" local-server.js

echo.
echo Server stopped.
pause
