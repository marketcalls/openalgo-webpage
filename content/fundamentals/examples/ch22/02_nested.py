# Real API responses are nested: dictionaries inside dictionaries inside lists.
response = {
    "status": "success",
    "data": {
        "symbol": "RELIANCE",
        "ltp": 1313.60,
        "depth": {
            "buy":  [{"price": 1313.55, "qty": 120}, {"price": 1313.50, "qty": 80}],
            "sell": [{"price": 1313.65, "qty": 95},  {"price": 1313.70, "qty": 150}],
        },
    },
}

# Dig through the layers with keys and list indexes.
data = response["data"]
print("Symbol   :", data["symbol"])
print("LTP      :", data["ltp"])
print("Best buy :", data["depth"]["buy"][0]["price"])    # first buy order's price
print("Best sell:", data["depth"]["sell"][0]["price"])
