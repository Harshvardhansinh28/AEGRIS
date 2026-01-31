import numpy as np
import pandas as pd
from pathlib import Path


# ============================================================
# Financial Metrics Engine
# ============================================================

def compute_returns(equity_curve: np.ndarray):
    returns = np.diff(equity_curve) / equity_curve[:-1]
    return returns


def sharpe_ratio(returns, risk_free_rate=0.02):
    if len(returns) < 2:
        return 0.0

    excess = returns - risk_free_rate / 252
    return np.sqrt(252) * np.mean(excess) / (np.std(excess) + 1e-8)


def max_drawdown(equity_curve):
    peak = np.maximum.accumulate(equity_curve)
    drawdown = (equity_curve - peak) / peak
    return drawdown.min()


def cagr(equity_curve, periods_per_year=252):
    total_return = equity_curve[-1] / equity_curve[0]
    years = len(equity_curve) / periods_per_year
    return total_return ** (1 / years) - 1


def volatility(returns):
    return np.std(returns) * np.sqrt(252)


def win_rate(returns):
    return np.mean(returns > 0)


def generate_report(equity_curve, save_dir="reports"):
    save_dir = Path(save_dir)
    save_dir.mkdir(exist_ok=True)

    equity_curve = np.array(equity_curve)
    returns = compute_returns(equity_curve)

    metrics = {
        "Final Equity": equity_curve[-1],
        "Total Return (%)": (equity_curve[-1] / equity_curve[0] - 1) * 100,
        "CAGR (%)": cagr(equity_curve) * 100,
        "Sharpe Ratio": sharpe_ratio(returns),
        "Max Drawdown (%)": max_drawdown(equity_curve) * 100,
        "Volatility (%)": volatility(returns) * 100,
        "Win Rate (%)": win_rate(returns) * 100,
    }

    df_metrics = pd.DataFrame(metrics, index=[0])
    df_metrics.to_csv(save_dir / "performance_metrics.csv", index=False)

    equity_df = pd.DataFrame({"equity": equity_curve})
    equity_df.to_csv(save_dir / "equity_curve.csv", index=False)

    print("\n📊 Performance Metrics")
    print(df_metrics.T)

    return metrics
