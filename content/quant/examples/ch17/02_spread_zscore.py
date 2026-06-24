# The spread's z-score is the pairs-trading signal: short the highs, buy the lows.
import os
from datetime import datetime
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns
import statsmodels.api as sm
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")


def close(symbol):
    return client.history(symbol=symbol, exchange="NSE", interval="D",
                          start_date="2021-01-01", end_date=end)["close"]


df = pd.concat([close("RELIANCE"), close("ONGC")], axis=1).dropna()
df.columns = ["RELIANCE", "ONGC"]
hedge = sm.OLS(df["RELIANCE"], sm.add_constant(df["ONGC"])).fit().params.iloc[1]
spread = df["RELIANCE"] - hedge * df["ONGC"]
z = (spread - spread.mean()) / spread.std()

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8, 4.5))
ax.plot(z.index, z, color="#7c83ff", lw=1)
ax.axhline(0, color="#555", lw=1)
ax.axhline(2, color="#dc2626", ls="--", lw=1.4, label="+/-2 sigma (entry)")
ax.axhline(-2, color="#16a34a", ls="--", lw=1.4)
ax.fill_between(z.index, 2, z, where=(z > 2), color="#dc2626", alpha=0.25)
ax.fill_between(z.index, -2, z, where=(z < -2), color="#16a34a", alpha=0.25)
ax.set_title("RELIANCE - ONGC spread z-score (short red, buy green, exit at 0)")
ax.set_ylabel("Z-score of the spread")
ax.legend()

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"Spread crossed +/-2 sigma on {int((z.abs() > 2).sum())} days - each a potential pairs trade. Saved {out.name}")
