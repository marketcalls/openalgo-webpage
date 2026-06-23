# Seaborn makes statistical charts beautiful by default. Here: a return distribution
# with a smooth density curve (KDE) laid over the histogram.
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
start = (datetime.now() - timedelta(days=180)).strftime("%Y-%m-%d")
df = client.history(symbol="CRUDEOIL20JUL26FUT", exchange="MCX", interval="D", start_date=start, end_date=end)
rets = df["close"].pct_change().dropna() * 100   # daily returns in percent

sns.set_theme(style="darkgrid")
fig, ax = plt.subplots(figsize=(8, 4.5))
sns.histplot(rets, bins=30, kde=True, color="#d29922", ax=ax)
ax.axvline(0, color="grey", linestyle="--")
ax.set_title("CRUDEOIL daily return distribution (Seaborn)")
ax.set_xlabel("Daily return (%)")

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print("Saved", out.name, "| std dev", round(rets.std(), 2), "%")
