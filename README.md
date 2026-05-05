# FAST_API_TELUSKO

A FastAPI backend with a React frontend for inventory/product management.

## Backend

### Requirements
- Python 3.12+
- PostgreSQL running locally

### Setup
1. Create a virtual environment:
   ```bash
   python -m venv myenv
   ```
2. Activate the env:
   - Windows PowerShell:
     ```powershell
     .\myenv\Scripts\Activate.ps1
     ```
   - Windows cmd:
     ```cmd
     .\myenv\Scripts\activate.bat
     ```
3. Install requirements from the backend folder:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
4. Configure environment variables (optional):
   - `DATABASE_URL` (default: `postgresql://postgres:1234@localhost:5432/telusko`)
   - `SECRET_KEY`
   - `ACCESS_TOKEN_EXPIRE_MINUTES`
   - `CORS_ORIGINS` (comma-separated list)
     - Example for local development only:
       `http://localhost:3000`
     - Example for Vercel frontend + Render backend:
       `http://localhost:3000,https://your-vercel-app.vercel.app`

### Run backend
From the backend folder:
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Or from the repo root:
```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

## Frontend

### Setup
```bash
cd frontend
npm install
```

### Run frontend
```bash
cd frontend
npm start
```

## Notes
- The backend now uses environment-based configuration for security.
- API requests are protected by JWT tokens and scoped to the authenticated user.
- The frontend login page now avoids fetching products before authentication.
- Add `.gitignore` to prevent committing virtual environments, node modules, and build artifacts.
