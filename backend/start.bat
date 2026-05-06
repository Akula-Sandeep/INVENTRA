@echo off
REM Backend deployment script for Windows

echo 🚀 Starting Inventra Backend Deployment...

REM Activate virtual environment if it exists
if exist "myenv\Scripts\activate.bat" (
    call myenv\Scripts\activate.bat
    echo ✓ Virtual environment activated
)

REM Install dependencies
echo 📦 Installing dependencies...
pip install --upgrade pip
pip install -r backend\requirements.txt

REM Create database tables
echo 🗄️  Setting up database...
python -c "^
from backend.database import engine^
import backend.database_models^
backend.database_models.Base.metadata.create_all(bind=engine)^
print('✓ Database tables created')^
"

REM Run diagnostics
echo 🔍 Running diagnostics...
python backend\diagnostics.py

REM Start server
echo 🚀 Starting Uvicorn server...
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
