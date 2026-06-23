# Two classic models: Logistic Regression and a Random Forest. Report accuracy.
import os
from datetime import datetime, timedelta

import pandas as pd
from openalgo import api, ta
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
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
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, shuffle=False)
base = max(yte.mean(), 1 - yte.mean())              # naive "always pick the common class"

logit = LogisticRegression(max_iter=1000).fit(Xtr, ytr)
forest = RandomForestClassifier(n_estimators=100, max_depth=4, random_state=0).fit(Xtr, ytr)
print(f"Naive baseline      : {base:.1%}")
print(f"Logistic Regression : {accuracy_score(yte, logit.predict(Xte)):.1%}")
print(f"Random Forest       : {accuracy_score(yte, forest.predict(Xte)):.1%}")
print("\nNext-bar direction is HARD: scores near the baseline are the honest norm.")
