import numpy as np
import pandas as pd
from pathlib import Path
import gymnasium as gym
from gymnasium import spaces

# ============================================================
# AEGRIS — Institutional Grade Trading Environment
# ============================================================

class TradingEnv(gym.Env):
    """
    AEGRIS Institutional Trading Environment

    Features:
    - Continuous portfolio allocation
    - Transaction costs + slippage
    - Position limits
    - Drawdown penalty
    - Risk-adjusted reward
    - Numerical stability protections
    """

    metadata = {"render_modes": ["human"]}

    def __init__(
        self,
        data_dir="datasets/processed",
        initial_cash=1_000_000,
        max_position=0.15,          # Max 15% per asset
        transaction_cost=0.001,     # 10 bps
        slippage=0.0005,             # 5 bps
        max_drawdown=0.25,           # 25% risk limit
        reward_scaling=1e3,
        window_size=1,
    ):
        super().__init__()

        # ------------------------
        # Resolve paths safely
        # ------------------------
        base_dir = Path(__file__).resolve().parents[1]
        self.data_dir = base_dir / data_dir

        # ------------------------
        # Load market data
        # ------------------------
        self.data = self._load_data()
        self.assets = list(self.data.keys())
        self.n_assets = len(self.assets)
        self.n_features = self.data[self.assets[0]].shape[1]

        # ------------------------
        # Risk Parameters
        # ------------------------
        self.initial_cash = float(initial_cash)
        self.max_position = float(max_position)
        self.transaction_cost = float(transaction_cost)
        self.slippage = float(slippage)
        self.max_drawdown = float(max_drawdown)
        self.reward_scaling = float(reward_scaling)
        self.window_size = int(window_size)

        # ------------------------
        # Action Space
        # Continuous portfolio weights
        # ------------------------
        self.action_space = spaces.Box(
            low=0.0,
            high=1.0,
            shape=(self.n_assets,),
            dtype=np.float32,
        )

        # ------------------------
        # Observation Space
        # market features + current weights + cash ratio
        # ------------------------
        obs_dim = self.n_assets * self.n_features + self.n_assets + 1
        self.observation_space = spaces.Box(
            low=-np.inf,
            high=np.inf,
            shape=(obs_dim,),
            dtype=np.float32,
        )

        # ------------------------
        # Internal State
        # ------------------------
        self.current_step = None
        self.portfolio_value = None
        self.peak_value = None
        self.weights = None
        self.returns_buffer = None

    # ============================================================
    # Data Loading
    # ============================================================

    def _load_data(self):
        data = {}
        csv_files = sorted(self.data_dir.glob("*.csv"))

        if len(csv_files) == 0:
            raise RuntimeError(f"No CSV files found in {self.data_dir}")

        for csv in csv_files:
            df = pd.read_csv(csv)

            # Keep only numeric features
            df = df.select_dtypes(include=[np.number])

            if df.isna().any().any():
                df = df.fillna(method="ffill").fillna(0)

            data[csv.stem] = df.values.astype(np.float32)

        # Align lengths
        min_len = min(len(v) for v in data.values())
        for k in data:
            data[k] = data[k][:min_len]

        return data

    # ============================================================
    # Reset
    # ============================================================

    def reset(self, seed=None, options=None):
        super().reset(seed=seed)

        self.current_step = self.window_size
        self.portfolio_value = self.initial_cash
        self.peak_value = self.initial_cash

        # Start equally weighted
        self.weights = np.ones(self.n_assets) / self.n_assets
        self.returns_buffer = []

        return self._get_obs(), {}

    # ============================================================
    # Observation
    # ============================================================

    def _get_obs(self):
        features = []

        for asset in self.assets:
            window = self.data[asset][self.current_step]
            features.append(window)

        features = np.concatenate(features)

        cash_ratio = np.array([1.0 - self.weights.sum()], dtype=np.float32)

        obs = np.concatenate([
            features,
            self.weights.astype(np.float32),
            cash_ratio,
        ])

        obs = np.nan_to_num(obs, nan=0.0, posinf=1.0, neginf=-1.0)

        return obs.astype(np.float32)

    # ============================================================
    # Step
    # ============================================================

    def step(self, action):
        # -----------------------
        # Normalize & clip action
        # -----------------------
        action = np.clip(action, 0, 1)

        if action.sum() == 0:
            target_weights = self.weights.copy()
        else:
            target_weights = action / action.sum()

        # Enforce max position limit
        target_weights = np.minimum(target_weights, self.max_position)
        target_weights = target_weights / target_weights.sum()

        # -----------------------
        # Transaction costs
        # -----------------------
        turnover = np.abs(target_weights - self.weights).sum()
        cost = turnover * (self.transaction_cost + self.slippage)

        # -----------------------
        # Compute returns
        # -----------------------
        asset_returns = []

        for asset in self.assets:
            prices = self.data[asset]
            p0 = prices[self.current_step - 1][0]
            p1 = prices[self.current_step][0]
            asset_returns.append((p1 / p0) - 1.0)

        asset_returns = np.array(asset_returns, dtype=np.float32)

        portfolio_return = np.dot(self.weights, asset_returns)
        portfolio_return -= cost

        # Numerical safety
        portfolio_return = np.clip(portfolio_return, -0.2, 0.2)

        # -----------------------
        # Update portfolio
        # -----------------------
        self.portfolio_value *= (1.0 + portfolio_return)
        self.peak_value = max(self.peak_value, self.portfolio_value)
        self.weights = target_weights.copy()
        self.current_step += 1

        # -----------------------
        # Drawdown
        # -----------------------
        drawdown = (self.peak_value - self.portfolio_value) / self.peak_value

        # -----------------------
        # Reward Engineering
        # -----------------------
        log_return = np.log1p(portfolio_return)
        self.returns_buffer.append(log_return)

        volatility = np.std(self.returns_buffer[-50:]) + 1e-8
        sharpe_proxy = log_return / volatility

        drawdown_penalty = -5.0 * max(0, drawdown - self.max_drawdown)

        reward = sharpe_proxy + drawdown_penalty
        reward *= self.reward_scaling

        # Safety
        reward = float(np.nan_to_num(reward))

        # -----------------------
        # Termination
        # -----------------------
        terminated = self.current_step >= len(self.data[self.assets[0]]) - 1
        truncated = False

        info = {
            "portfolio_value": self.portfolio_value,
            "drawdown": drawdown,
            "turnover": turnover,
            "volatility": volatility,
        }

        return self._get_obs(), reward, terminated, truncated, info

    # ============================================================
    # Render
    # ============================================================

    def render(self):
        print(
            f"Step: {self.current_step} | "
            f"Portfolio: ${self.portfolio_value:,.2f} | "
            f"Drawdown: {100 * (self.peak_value - self.portfolio_value) / self.peak_value:.2f}%"
        )
