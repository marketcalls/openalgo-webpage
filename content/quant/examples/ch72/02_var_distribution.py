# The risk-parity book's daily-return distribution with the 95% VaR line and CVaR tail marked.
import os
from datetime import datetime, timedelta
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=1095)).strftime("%Y-%m-%d")
syms = ["RELIANCE", "HDFCBANK", "INFY", "ITC", "TATASTEEL"]
rets = pd.DataFrame({s: client.history(symbol=s, exchange="NSE", interval="D",
                                       start_date=start, end_date=end)["close"].pct_change()
                     for s in syms}).dropna()

vol = rets.std()
w = (1 / vol) / (1 / vol).sum()
port = (rets @ w) * 100              # daily portfolio returns, in percent

var95 = np.percentile(port, 5)       # threshold loss (negative)
cvar95 = port[port <= var95].mean()  # average loss across the tail

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8, 4.5))
sns.histplot(port, bins=60, color="#7c83ff", alpha=0.65, edgecolor="white", linewidth=0.3, ax=ax)
ax.axvspan(port.min() - 0.3, var95, color="#dc2626", alpha=0.10)
ax.axvline(var95, color="#dc2626", lw=2, ls="--", label=f"95% VaR = {var95:.2f}%")
ax.axvline(cvar95, color="#7c1d1d", lw=2, label=f"95% CVaR = {cvar95:.2f}%")
ax.set_title("Risk-parity book: daily-return distribution, with VaR line and CVaR tail")
ax.set_xlabel("Daily portfolio return (%)")
ax.set_ylabel("Number of days")
ax.legend()

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"VaR {var95:.2f}%, CVaR {cvar95:.2f}%, worst day {port.min():.2f}%. Saved {out.name}")
