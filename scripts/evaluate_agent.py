from pathlib import Path
import numpy as np

from stable_baselines3 import SAC
from stable_baselines3.common.vec_env import DummyVecEnv, VecNormalize

from trading_env import TradingEnv

# -------------------------------
# Resolve paths
# -------------------------------
BASE_DIR = Path(__file__).resolve().parents[1]
CHECKPOINT_DIR = BASE_DIR / "models" / "checkpoints"

MODEL_PATH = CHECKPOINT_DIR / "aegris_sac_final"
VECNORM_PATH = CHECKPOINT_DIR / "vecnormalize.pkl"

# -------------------------------
# Load Environment
# -------------------------------
def make_env():
    return TradingEnv()

env = DummyVecEnv([make_env])

# Load normalization statistics
env = VecNormalize.load(VECNORM_PATH, env)
env.training = False
env.norm_reward = False

# -------------------------------
# Load Model
# -------------------------------
model = SAC.load(MODEL_PATH, env=env)

# -------------------------------
# Run Evaluation
# -------------------------------
obs = env.reset()
portfolio_values = []

print("\n📊 Running evaluation...")

for step in range(1_000):
    action, _ = model.predict(obs, deterministic=True)
    obs, rewards, dones, infos = env.step(action)

    portfolio_value = infos[0].get("portfolio_value", np.nan)
    portfolio_values.append(portfolio_value)

    if step % 100 == 0:
        print(f"Step {step} | Portfolio Value: {portfolio_value:.2f}")

from metrics import generate_report

print("\n✅ Evaluation finished.")
print(f"Final Portfolio Value: {portfolio_values[-1]:.2f}")

# Generate metrics report (save to scripts/reports)
REPORTS_DIR = BASE_DIR / "scripts" / "reports"
REPORTS_DIR.mkdir(parents=True, exist_ok=True)
generate_report(portfolio_values, save_dir=str(REPORTS_DIR))

env.close()

