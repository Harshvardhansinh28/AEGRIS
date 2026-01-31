@echo off
REM Run from project root. Start backend then frontend.
echo Starting AegisRL backend on http://127.0.0.1:8000
start "AegisRL Backend" cmd /k "pip install -r backend/requirements.txt 2>nul & uvicorn backend.app:app --reload --host 0.0.0.0 --port 8000"
timeout /t 3 /nobreak >nul
echo Starting frontend on http://localhost:3000
cd frontend
start "AegisRL Frontend" cmd /k "npm run dev"
cd ..
