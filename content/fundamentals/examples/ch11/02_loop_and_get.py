quote = {"symbol": "RELIANCE", "ltp": 1313.60, "change": 13.60}

# .items() hands you each key and its value together - perfect for a loop.
for field, value in quote.items():
    print(f"{field:>8}: {value}")

# get() safely fetches a key, returning a fallback if it's missing - no crash.
print("Bid       :", quote.get("bid", "not available"))
