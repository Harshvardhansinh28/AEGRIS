from fastapi import APIRouter, HTTPException
from services.ml.service import simulation_service

router = APIRouter(prefix="/api/simulation", tags=["simulation"])

@router.post("/start")
async def start_simulation():
    """Reset and start the simulation"""
    try:
        state = simulation_service.reset()
        return state
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/step")
async def step_simulation():
    """Advance the simulation by one step. Returns current state (with running=False if not active)."""
    try:
        state = simulation_service.step()
        return state
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/state")
async def get_state():
    """Get current simulation state"""
    return simulation_service.get_state()

@router.get("/history")
async def get_history():
    """Get full simulation history"""
    return simulation_service.get_history()


@router.get("/health")
async def health():
    """Backend and model status for frontend"""
    return {
        "status": "ok",
        "model_loaded": simulation_service.model is not None,
        "running": simulation_service.running,
    }
