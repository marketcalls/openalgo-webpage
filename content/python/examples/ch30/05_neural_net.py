# The NEURAL NETWORK: an MLPClassifier. Same job, layered "neurons" inside.
import os
from datetime import datetime, timedelta

import pandas as pd
from openalgo import api, ta
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPClassifier
from sklearn.preprocessing import StandardScaler

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
# Neural nets need features on a similar scale -- fit the scaler on TRAIN only.
scaler = StandardScaler().fit(Xtr)
Xtr_s, Xte_s = scaler.transform(Xtr), scaler.transform(Xte)

# hidden_layer_sizes=(16, 8): two hidden layers of 16 and 8 neurons.
mlp = MLPClassifier(hidden_layer_sizes=(16, 8), max_iter=1000, random_state=0).fit(Xtr_s, ytr)
print(f"Naive baseline : {max(yte.mean(), 1 - yte.mean()):.1%}")
print(f"Neural net (MLP): {accuracy_score(yte, mlp.predict(Xte_s)):.1%}")
print("\nMore layers can fit more complex patterns -- and overfit faster. Bigger is not safer.")
