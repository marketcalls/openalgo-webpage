# The overfit gap: train accuracy soars, test accuracy sits at a coin flip.
import os
from datetime import datetime
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns
from openalgo import api
from sklearn.ensemble import RandomForestClassifier

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
c = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                   start_date="2019-01-01", end_date=end)["close"]
r = c.pct_change()
df = pd.DataFrame(index=c.index)
for lag in [1, 2, 3, 5]:
    df[f"ret{lag}"] = r.shift(lag)
df["mom10"] = c.pct_change(10).shift(1)
df["vol10"] = r.rolling(10).std().shift(1)
df["target"] = (r.shift(-1) > 0).astype(int)
df = df.dropna()
X, y = df.drop(columns="target"), df["target"]
split = int(len(df) * 0.7)

# The deeper the trees, the more the model memorises - and the wider the overfit gap.
rows = []
for depth in [2, 5, 10, 20]:
    m = RandomForestClassifier(n_estimators=200, max_depth=depth, random_state=0).fit(X[:split], y[:split])
    rows.append({"depth": str(depth), "set": "train", "acc": m.score(X[:split], y[:split]) * 100})
    rows.append({"depth": str(depth), "set": "test", "acc": m.score(X[split:], y[split:]) * 100})

data = pd.DataFrame(rows)
sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8, 4.5))
sns.barplot(data=data, x="depth", y="acc", hue="set",
            palette={"train": "#dc2626", "test": "#16a34a"}, ax=ax)
ax.axhline(50, color="#555", ls="--", lw=1, label="coin flip (50%)")
ax.set_title("ML overfit gap - train accuracy climbs, test stays at chance")
ax.set_xlabel("Tree depth (model complexity)")
ax.set_ylabel("Accuracy (%)")
ax.legend()
out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"Deepest model: train {data.iloc[-2]['acc']:.0f}% vs test {data.iloc[-1]['acc']:.0f}%. Saved {out.name}")
