# A walk-forward sanity check for ML: retrain each window, grade on the next.
import os
from datetime import datetime, timedelta

import pandas as pd
from openalgo import api, ta
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

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

train_len, test_len, i, scores = 300, 100, 0, []
while i + train_len + test_len <= len(X):
    model = RandomForestClassifier(n_estimators=100, max_depth=4, random_state=0)
    model.fit(X.iloc[i:i + train_len], y.iloc[i:i + train_len])         # train on window
    te_X = X.iloc[i + train_len:i + train_len + test_len]
    te_y = y.iloc[i + train_len:i + train_len + test_len]
    acc = accuracy_score(te_y, model.predict(te_X))                     # grade next window
    base = max(te_y.mean(), 1 - te_y.mean())
    scores.append(acc)
    print(f"window {i // test_len + 1}: accuracy {acc:.1%}  vs baseline {base:.1%}")
    i += test_len
print(f"\nAverage out-of-sample accuracy: {sum(scores) / len(scores):.1%}")
print("Consistently beating the baseline across windows is the bar for a real edge.")
