# Visualise seasonality: a year x month grid of NIFTY monthly returns.
import os
from datetime import datetime, timedelta
from pathlib import Path

import matplotlib.pyplot as plt
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=1100)).strftime("%Y-%m-%d")
df = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D", start_date=start, end_date=end)

monthly = df["close"].resample("ME").last().pct_change() * 100
grid = monthly.groupby([monthly.index.year, monthly.index.month]).mean().unstack()

fig, ax = plt.subplots(figsize=(9, 3.5))
im = ax.imshow(grid.values, cmap="RdYlGn", aspect="auto", vmin=-8, vmax=8)
ax.set_xticks(range(len(grid.columns)))
ax.set_xticklabels(["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][:len(grid.columns)])
ax.set_yticks(range(len(grid.index)))
ax.set_yticklabels(grid.index)
ax.set_title("NIFTY monthly return (%) by year")
fig.colorbar(im, ax=ax, label="% return")

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print("Saved", out.name)
print(grid.round(1))
