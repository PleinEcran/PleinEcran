@echo off
REM Double-cliquez sur ce fichier pour recuperer les illustrations libres.
cd /d "%~dp0"
echo Continue ? - recuperation des illustrations libres
echo.
python illustrations.py
if errorlevel 9009 (
  echo.
  echo Python n existe pas sur cette machine.
  echo Installez-le depuis https://www.python.org/downloads/ en cochant "Add Python to PATH",
  echo puis relancez ce fichier.
  pause
)
