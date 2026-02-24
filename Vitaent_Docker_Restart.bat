@echo off
title Vitaent Docker Restart

echo ==========================================
echo        VITAENT DOCKER RESTART
echo ==========================================
echo.

docker compose down -v

echo.
docker compose up --build

echo.
pause