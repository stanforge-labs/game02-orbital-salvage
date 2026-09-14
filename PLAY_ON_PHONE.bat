@echo off
chcp 65001 >nul
title ORBITAL SALVAGE - PHONE TEST
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\PLAY_ON_PHONE.ps1" %*
if errorlevel 1 pause
