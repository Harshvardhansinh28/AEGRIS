import os
from pathlib import Path

import gymnasium as gym
from stable_baselines3 import SAC
from stable_baselines3.common.vec_env import DummyVecEnv, VecNormalize
from stable_baselines3.common.monitor import Monitor
from stable_baselines3.common.callbacks import CheckpointCallback

from trading_env import TradingEnv

# -------------------------------
# Resolve project root safely
# -------------------------------
BASE_DIR = Path(__file__).resolve().parents[1]
CHECKPOINT_DIR = BASE_DIR / "models" / "checkpoints"
CHECKPOINT_DIR.mkdir(parents=True, exist_ok=True)

TOTAL_STEPS = 20_000   # fast retrain (increase later)
MODEL_NAME = "aegris_sac_final"

# -------------------------------
# Environment Factory
# -------------------------------
def make_env():
    env = TradingEnv()
    env = Monitor(env)
    return env

# -------------------------------
# Build Vectorized Environment
# -------------------------------
env = DummyVecEnv([make_env])

# Normalize observations + rewards
env = VecNormalize(
    env,
    norm_obs=True,
    norm_reward=True,
    clip_obs=10.0
)

# -------------------------------
# Model
# -------------------------------
model = SAC(
    policy="MlpPolicy",
    env=env,
    learning_rate=3e-4,
    batch_size=256,
    buffer_size=200_000,
    learning_starts=1_000,
    gamma=0.99,
    tau=0.005,
    verbose=1,
    tensorboard_log=str(BASE_DIR / "logs"),
)

# -------------------------------
# Checkpointing
# -------------------------------
checkpoint_callback = CheckpointCallback(
    save_freq=5_000,
    save_path=str(CHECKPOINT_DIR),
    name_prefix="aegris_checkpoint",
)

# -------------------------------
# Train
# -------------------------------
print("🚀 Training started...")
model.learn(
    total_timesteps=TOTAL_STEPS,
    callback=checkpoint_callback,
    progress_bar=True,
)

# -------------------------------
# Save Model + Normalization
# -------------------------------
MODEL_PATH = CHECKPOINT_DIR / MODEL_NAME
VECNORM_PATH = CHECKPOINT_DIR / "vecnormalize.pkl"

model.save(MODEL_PATH)
env.save(VECNORM_PATH)

print("\n✅ Training completed successfully!")
print(f"✅ Model saved at: {MODEL_PATH}")
print(f"✅ VecNormalize saved at: {VECNORM_PATH}")

env.close()



