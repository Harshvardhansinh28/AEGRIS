# AegisRL™ – Enterprise Adaptive RL Portfolio Platform

Cloud-native AI trading platform: deep reinforcement learning for dynamic portfolio allocation, regime adaptation, risk constraints, and full explainability. Built with a **FastAPI** backend and **Next.js** frontend.

---

## Tech stack

| Layer        | Stack |
|-------------|--------|
| **Frontend** | Next.js 16, React 19, Tailwind, Framer Motion, Recharts, Three.js |
| **Backend**  | FastAPI, Uvicorn |
| **ML/RL**    | PyTorch, Stable-Baselines3 (SAC), Gymnasium |
| **Data**     | pandas, yfinance, ta (technical analysis) |

---

## Requirements

- **Python** 3.10+ (recommended: 3.11)
- **Node.js** 18+ (for frontend)
- **npm** or **yarn**

---

## Setup

### 1. Clone and create a virtual env (recommended)

```bash
cd AEGRIS
python -m venv .venv
.venv\Scripts\activate   # Windows
# source .venv/bin/activate   # Linux / macOS
```

### 2. Install Python dependencies

**Option A – Full project (scripts + backend):**

```bash
pip install -r requirements.txt
```

**Option B – Backend only (API + ML inference):**

```bash
pip install -r backend/requirements.txt
```

---

## Data & ML pipeline (run from project root)

Run these in order. All paths are relative to the project root.

| Step | Command | Output |
|------|--------|--------|
| 1. Download raw data | `python scripts/download_data.py` | `datasets/raw/*.csv` |
| 2. Build features | `python scripts/build_features.py` | `datasets/processed/*.csv` |
| 3. Train SAC agent | `python scripts/train_agent.py` | `models/checkpoints/aegris_sac_final.zip`, `vecnormalize.pkl` |
| 4. Evaluate (optional) | `python scripts/evaluate_agent.py` | `scripts/reports/performance_metrics.csv`, `equity_curve.csv` |

- **Step 1** needs `yfinance`, `ta` (in `requirements.txt`).
- **Step 2** needs `ta`, `pandas`.
- **Step 3** needs `stable-baselines3`, `gymnasium`, `torch`.
- **Step 4** uses the same env and writes reports under `scripts/reports/`.

---

## Backend (FastAPI)

From **project root**:

```bash
pip install -r backend/requirements.txt
uvicorn backend.app:app --reload --host 0.0.0.0 --port 8000
```

- Loads the SAC model from `models/checkpoints/` and uses `datasets/processed/` for the trading environment.
- If the model or data is missing, the API still runs; simulation returns the last/default state with `running: false`.

### API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Simple health |
| GET | `/api/simulation/health` | `status`, `model_loaded`, `running` |
| POST | `/api/simulation/start` | Reset and start simulation |
| POST | `/api/simulation/step` | Advance one step (returns state; `running: false` when not active) |
| GET | `/api/simulation/state` | Current state |
| GET | `/api/simulation/history` | Full simulation history |

---

## Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

- App: **http://localhost:3000**
- Default API base: **http://127.0.0.1:8000**
- Override via env: **`NEXT_PUBLIC_API_BASE_URL`** (e.g. `http://localhost:8000` or your deployed backend URL).

The dashboard uses `/api/simulation/start`, `/step`, `/state`, and `/history` to drive the live simulation and charts.

---

## Requirements files

| File | Purpose |
|------|--------|
| **requirements.txt** | Full project: data scripts, ML training/eval, backend, optional (mlflow, streamlit, plotly). |
| **backend/requirements.txt** | Backend only: FastAPI, uvicorn, numpy, pandas, gymnasium, stable-baselines3, torch. |

Use **requirements.txt** when you run scripts and the backend; use **backend/requirements.txt** for a minimal backend install (e.g. in a container).

---

## Quick start (Windows)

```bash
start.bat
```

Starts the backend (port 8000) and frontend (port 3000) in separate windows. Ensure you have run the data pipeline and training at least once so the backend can load the model and data.
