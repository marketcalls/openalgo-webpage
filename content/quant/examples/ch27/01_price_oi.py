# Price tells you direction; open interest tells you conviction. Read them together.
import os
from datetime import datetime, timedelta

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

SYMBOL, EXCHANGE = "NIFTY30JUN26FUT", "NFO"
end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")
df = client.history(symbol=SYMBOL, exchange=EXCHANGE, interval="D", start_date=start, end_date=end)

df["dprice"] = df["close"].diff()
df["doi"] = df["oi"].diff()


def positioning(dp, doi):
    if dp > 0 and doi > 0:
        return "Long buildup (fresh bulls)"
    if dp < 0 and doi > 0:
        return "Short buildup (fresh bears)"
    if dp > 0 and doi < 0:
        return "Short covering (bears exit)"
    if dp < 0 and doi < 0:
        return "Long unwinding (bulls exit)"
    return "-"


print(f"{SYMBOL}\n{'DATE':12s}{'CLOSE':>10s}{'OI':>13s}   POSITIONING")
for ts, row in df.tail(8).iterrows():
    print(f"{str(ts.date()):12s}{row['close']:>10.1f}{int(row['oi']):>13d}   {positioning(row['dprice'], row['doi'])}")
print("\nRising price + rising OI = new money backing the move. Falling OI = positions closing.")
