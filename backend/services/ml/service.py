import numpy as np
from pathlib import Path
from stable_baselines3 import SAC
from stable_baselines3.common.vec_env import DummyVecEnv, VecNormalize

from .trading_env import TradingEnv
from .metrics import compute_returns, sharpe_ratio, max_drawdown

class SimulationService:
    _instance = None
    
    def __init__(self):
        self.env = None
        self.model = None
        self.obs = None
        self.done = False
        self.history = []
        self.running = False
        
        # Paths
        # Navigate from backend/services/ml -> backend/services -> backend -> root
        self.root_dir = Path(__file__).resolve().parents[3]
        self.model_path = self.root_dir / "models" / "checkpoints" / "aegris_sac_final"
        self.vecnorm_path = self.root_dir / "models" / "checkpoints" / "vecnormalize.pkl"

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def initialize(self):
        """Load model and env"""
        if self.model is not None:
            return
            
        print("Loading Aegris Model...")
        
        # Create env
        def make_env():
            return TradingEnv()
            
        self.env = DummyVecEnv([make_env])
        
        # Load normalization
        if self.vecnorm_path.exists():
            self.env = VecNormalize.load(str(self.vecnorm_path), self.env)
            self.env.training = False
            self.env.norm_reward = False
        else:
            print(f"Warning: Normalization stats not found at {self.vecnorm_path}")
            
        # Load model
        if self.model_path.with_suffix(".zip").exists():
            self.model = SAC.load(str(self.model_path), env=self.env)
            print("Model loaded successfully.")
        else:
            print(f"Error: Model not found at {self.model_path}")
            # Fallback for dev without model
            self.model = None

        self.reset()
    
    def reset(self):
        if self.env:
            self.obs = self.env.reset()
            self.done = False
            self.history = []
            self.running = True
            return self.get_state()
        return None

    def step(self):
        state = self.get_state()
        if not self.running or self.env is None or self.model is None:
            return {**state, "running": False}

        action, _ = self.model.predict(self.obs, deterministic=True)
        # VecEnv.step returns (obs, rewards, dones, infos)
        self.obs, rewards, dones, infos = self.env.step(action)
        step_info = infos[0]
        self.done = bool(dones[0])

        # Get weights from unwrapped env (VecNormalize/DummyVecEnv/Monitor may wrap)
        base = getattr(self.env, "venv", self.env)
        env_unwrapped = base.envs[0]
        while hasattr(env_unwrapped, "env"):
            env_unwrapped = env_unwrapped.env
        weights = env_unwrapped.weights.tolist() if hasattr(env_unwrapped, "weights") else []

        snapshot = {
            "step": len(self.history),
            "portfolio_value": float(step_info.get("portfolio_value", 0)),
            "drawdown": float(step_info.get("drawdown", 0)),
            "volatility": float(step_info.get("volatility", 0)),
            "turnover": float(step_info.get("turnover", 0)),
            "weights": weights,
            "running": True,
        }
        self.history.append(snapshot)
        return snapshot
        
    def get_history(self):
        return self.history
        
    def get_state(self):
        if not self.history:
            return {
                "step": 0,
                "portfolio_value": 1_000_000,
                "drawdown": 0,
                "volatility": 0,
                "turnover": 0,
                "weights": [],
                "running": self.running,
            }
        out = dict(self.history[-1])
        out["running"] = self.running
        return out

simulation_service = SimulationService.get_instance()
