# Can ML predict tomorrow's direction? Train honestly on time-ordered data and see.
import os
from datetime import datetime

import pandas as pd
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
    df[f"ret{lag}"] = r.shift(lag)              # only PAST returns as features
df["mom10"] = c.pct_change(10).shift(1)
df["vol10"] = r.rolling(10).std().shift(1)
df["target"] = (r.shift(-1) > 0).astype(int)    # did tomorrow go up?
df = df.dropna()

X, y = df.drop(columns="target"), df["target"]
split = int(len(df) * 0.7)                       # time-ordered split - NEVER shuffle a time series
model = RandomForestClassifier(n_estimators=200, max_depth=5, random_state=0)
model.fit(X[:split], y[:split])

train_acc = model.score(X[:split], y[:split]) * 100
test_acc = model.score(X[split:], y[split:]) * 100
baseline = max(y[split:].mean(), 1 - y[split:].mean()) * 100

print(f"Train accuracy             : {train_acc:.1f}%")
print(f"Test accuracy (out-of-sample): {test_acc:.1f}%")
print(f"Baseline (always guess majority): {baseline:.1f}%")
print("\nHigh train, ~coin-flip test = the model memorised noise. Direction resists ML prediction.")
