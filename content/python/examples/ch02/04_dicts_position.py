# OpenAlgo returns data as dictionaries, so model a position as one too.
position = {"symbol": "SBIN", "exchange": "NSE", "qty": 750, "avg_price": 812.4}

print("Symbol      :", position["symbol"])
print("Invested    :", position["qty"] * position["avg_price"])

position["ltp"] = 818.0  # add a new key
position["pnl"] = (position["ltp"] - position["avg_price"]) * position["qty"]

print("Live P&L    :", round(position["pnl"], 2))
print("All fields  :", list(position.keys()))
