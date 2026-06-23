# A month-by-year heatmap of returns: spot seasonal strength and weak patches at a glance.
import os
from datetime import datetime, timedelta
from pathlib import Path

import matplotlib.pyplot as plt
import seaborn as sns
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=1000)).strftime("%Y-%m-%d")
df = client.history(symbol="RELIANCE", exchange="NSE", interval="D", start_date=start, end_date=end)

monthly = df["close"].resample("ME").last().pct_change().dropna() * 100
table = monthly.groupby([monthly.index.year, monthly.index.month]).first().unstack(level=1)
table.index.name, table.columns.name = "Year", "Month"

sns.set_theme(style="white")
fig, ax = plt.subplots(figsize=(9, 4.5))
sns.heatmap(table, annot=True, fmt=".1f", cmap="RdYlGn", center=0, ax=ax)
ax.set_title("RELIANCE monthly returns (%)")

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print("Saved", out.name)
