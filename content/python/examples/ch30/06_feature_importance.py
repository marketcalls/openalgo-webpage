# Which clues mattered? A Random Forest ranks its features by importance.
import os
from datetime import datetime, timedelta
from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd
from openalgo import api, ta
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=900)).strftime("%Y-%m-%d")
df = client.history(symbol="RELIANCE", exchange="NSE", interval="D", start_date=start, end_date=end)
c = df["close"]
d = pd.DataFrame(index=df.index)
d["rsi"] = ta.rsi(c, 14); d["ret1"] = c.pct_change(); d["ret5"] = c.pct_change(5)
d["atr"] = ta.atr(df["high"], df["low"], c, 14); d["ema_dist"] = (c - ta.ema(c, 20)) / c
d["target"] = (c.shift(-1) > c).astype(int)
d = d.dropna()

X, y = d.drop(columns="target"), d["target"]
Xtr, _, ytr, _ = train_test_split(X, y, test_size=0.25, shuffle=False)
forest = RandomForestClassifier(n_estimators=150, max_depth=4, random_state=0).fit(Xtr, ytr)
imp = pd.Series(forest.feature_importances_, index=X.columns).sort_values()

print("Feature importance (higher = the model leaned on it more):")
print((imp * 100).round(1).astype(str) + " %")
fig, ax = plt.subplots(figsize=(7, 3.5))
ax.barh(imp.index, imp.values, color="#1f6feb")
ax.set_title("RELIANCE next-bar model: feature importance")
out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print("Saved", out.name)
