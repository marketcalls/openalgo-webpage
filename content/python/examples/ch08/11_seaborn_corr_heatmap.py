# A correlation heatmap shows which stocks move together. Diversification lives
# in the cool-coloured (low correlation) pairs.
import os
from datetime import datetime, timedelta
from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=180)).strftime("%Y-%m-%d")
syms = ["RELIANCE", "TCS", "INFY", "HDFCBANK", "SBIN", "ICICIBANK"]
closes = {s: client.history(symbol=s, exchange="NSE", interval="D",
                            start_date=start, end_date=end)["close"] for s in syms}
rets = pd.DataFrame(closes).pct_change().dropna()

sns.set_theme(style="white")
fig, ax = plt.subplots(figsize=(7, 5.5))
sns.heatmap(rets.corr(), annot=True, fmt=".2f", cmap="coolwarm", vmin=-1, vmax=1, ax=ax)
ax.set_title("Return correlation across large-cap stocks")

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print("Saved", out.name)
