from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import simulation, market, chat
from services.ml.service import simulation_service

app = FastAPI(title="AEGRIS API", description="Institutional Trading Agent API", version="1.0.0")

# CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
      "https://aegris33.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(simulation.router)
app.include_router(market.router)
app.include_router(chat.router)

@app.on_event("startup")
async def startup_event():
    print("Initializing Simulation Service...")
    simulation_service.initialize()

@app.get("/")
async def root():
    return {"message": "AEGRIS Backend Operational"}
