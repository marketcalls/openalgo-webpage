# The liquidity ladder: rank a basket from deepest to thinnest by Amihud illiquidity.
import os
from datetime import datetime, timedelta
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=365)).strftime("%Y-%m-%d")
basket = ["HDFCBANK", "RELIANCE", "INFY", "TATASTEEL", "BANKBARODA", "YESBANK"]

rows = []
for sym in basket:
    df = client.history(symbol=sym, exchange="NSE", interval="D", start_date=start, end_date=end)
    abs_ret = df["close"].pct_change().abs()
    rupee_vol = df["volume"] * df["close"]
    illiq = (abs_ret / rupee_vol.replace(0, float("nan"))).dropna().mean() * 1e9
    rows.append({"stock": sym, "illiquidity": illiq})

data = pd.DataFrame(rows).sort_values("illiquidity")

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8, 4.5))
sns.barplot(data=data, x="illiquidity", y="stock", hue="stock", legend=False, palette="rocket_r", ax=ax)
ax.set_title("The liquidity ladder - Amihud illiquidity (higher = thinner)")
ax.set_xlabel("Amihud illiquidity (x1e9)")
ax.set_ylabel("")

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print("Deepest:", data["stock"].iloc[0], "| thinnest:", data["stock"].iloc[-1], "| saved", out.name)
