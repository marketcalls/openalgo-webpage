# A volatility-aware stop: place it 2 x ATR away, then size off that distance.
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

RISK_PCT = 1.0
ATR_MULT = 2.0
SYMBOL, EXCHANGE = "RELIANCE", "NSE"

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=250)).strftime("%Y-%m-%d")
df = client.history(symbol=SYMBOL, exchange=EXCHANGE, interval="D", start_date=start, end_date=end)

entry = df["close"].iloc[-1]
atr = ta.atr(df["high"], df["low"], df["close"], 14).iloc[-1]
stop_distance = ATR_MULT * atr

capital = float(client.funds()["data"]["availablecash"])
risk_amount = capital * RISK_PCT / 100
qty = int(risk_amount // stop_distance)

print(f"{SYMBOL}: entry {entry:.2f}   ATR(14) {atr:.2f}")
print(f"Stop {ATR_MULT:.0f}xATR away -> {entry - stop_distance:.2f}   (risk/share {stop_distance:.2f})")
print(f"Risk budget {risk_amount:,.2f}  ->  quantity {qty}")
print("\nCalm stock -> tight ATR -> bigger size; wild stock -> smaller size, same rupee risk.")
