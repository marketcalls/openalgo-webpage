# CAPSTONE: an end-to-end ML bot -- fetch, learn, signal, order (analyze), alert.
import os
from datetime import datetime, timedelta

import pandas as pd
from openalgo import api, ta
from sklearn.ensemble import RandomForestClassifier

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)
SYMBOL, EXCHANGE = "RELIANCE", "NSE"

# 1) FETCH
end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=900)).strftime("%Y-%m-%d")
df = client.history(symbol=SYMBOL, exchange=EXCHANGE, interval="D", start_date=start, end_date=end)
c = df["close"]
# 2) FEATURES + label (predict next bar up/down)
d = pd.DataFrame(index=df.index)
d["rsi"] = ta.rsi(c, 14); d["ret1"] = c.pct_change(); d["ema_dist"] = (c - ta.ema(c, 20)) / c
d["target"] = (c.shift(-1) > c).astype(int)
feats = ["rsi", "ret1", "ema_dist"]
train = d.dropna()                                            # rows with a known answer
# 3) TRAIN on all complete rows, then predict TODAY's row (whose answer is unknown)
model = RandomForestClassifier(n_estimators=120, max_depth=4, random_state=0)
model.fit(train[feats], train["target"])
today = d[feats].iloc[[-1]]                                   # latest features
signal = int(model.predict(today)[0])                         # 1 = expect up, 0 = expect down
print(f"Model signal for {SYMBOL}: predicted next bar {'UP' if signal else 'DOWN'}")

# 4) ACT -- long-only bot: enter on UP, square off to flat on DOWN. Safe in analyze mode.
if signal == 1:
    resp = client.placeorder(strategy="MLBot", symbol=SYMBOL, action="BUY",
                             exchange=EXCHANGE, price_type="MARKET", product="CNC", quantity=1)
    print("Enter long  ->", resp.get("status"), resp.get("orderid", resp.get("message")))
else:
    # placesmartorder with position_size=0 means "hold zero" -- it exits any long, else no-op.
    resp = client.placesmartorder(strategy="MLBot", symbol=SYMBOL, action="SELL",
                                  exchange=EXCHANGE, price_type="MARKET", product="CNC",
                                  quantity=0, position_size=0)
    print("Square off  ->", resp.get("status"), resp.get("message", resp.get("orderid")))
# 5) ALERT (optional) -- degrades gracefully if Telegram is not linked
try:
    alert = client.telegram(username=os.getenv("OPENALGO_TG_USER", "openalgo"),
                            message=f"MLBot {SYMBOL}: {'BUY' if signal else 'FLAT'}")
    print("Telegram:", alert.get("status"))
except Exception as exc:                                      # noqa: BLE001
    print("Telegram skipped:", exc)
