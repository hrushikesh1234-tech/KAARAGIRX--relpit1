@echo off
start "Server" cmd /k "cd /d %~dp0 && npm run dev:server"
timeout /t 5
start "Client" cmd /k "cd /d %~dp0\client && npm run dev"
