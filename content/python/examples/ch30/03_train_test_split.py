# Split features+label into train/test -- shuffle=False, because time has an order.
import os
from datetime import datetime, timedelta

import pandas as pd
from openalgo import api, ta
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
d["rsi"] = ta.rsi(c, 14)
d["ret1"] = c.pct_change()
d["target"] = (c.shift(-1) > c).astype(int)
d = d.dropna()

X = d[["rsi", "ret1"]]                             # the clues (features)
y = d["target"]                                    # the answer (label)
# shuffle=False keeps the split chronological: train on the past, test on the future.
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, shuffle=False)

print(f"Train rows: {len(X_train)}  ({X_train.index[0].date()} -> {X_train.index[-1].date()})")
print(f"Test rows : {len(X_test)}  ({X_test.index[0].date()} -> {X_test.index[-1].date()})")
print("\nThe model learns on train and is graded on test -- data it never saw.")
