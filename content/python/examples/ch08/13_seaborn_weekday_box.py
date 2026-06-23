# A box plot of returns by weekday: does any day behave differently? Seaborn shows
# the spread, the median, and the outliers all at once.
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
start = (datetime.now() - timedelta(days=500)).strftime("%Y-%m-%d")
df = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D", start_date=start, end_date=end)
rets = df["close"].pct_change().dropna() * 100

data = pd.DataFrame({"Weekday": rets.index.day_name(), "Return": rets.values})
order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

sns.set_theme(style="darkgrid")
fig, ax = plt.subplots(figsize=(8.5, 4.5))
sns.boxplot(data=data, x="Weekday", y="Return", order=order, hue="Weekday", palette="viridis", legend=False, ax=ax)
ax.axhline(0, color="grey", linestyle="--")
ax.set_title("NIFTY daily returns by weekday")

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print("Saved", out.name)
