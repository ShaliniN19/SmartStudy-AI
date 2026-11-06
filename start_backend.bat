@echo off
echo ========================================================
echo       Starting SmartStudy AI - Python Flask Backend
echo ========================================================
cd backend
if not exist .env (
    copy .env.example .env
    echo Created .env from .env.example. Add your GEMINI_API_KEY if desired.
)
python app.py
pause
