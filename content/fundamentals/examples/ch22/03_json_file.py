import json

watchlist = {"RELIANCE": 1313.60, "TCS": 2109.00, "INFY": 1056.60}

# json.dump (no "s") writes a dict straight to a FILE.
with open("watchlist.json", "w") as f:
    json.dump(watchlist, f, indent=2)

# json.load (no "s") reads a FILE straight back into a dict.
with open("watchlist.json") as f:
    loaded = json.load(f)

print("Loaded:", loaded)
print("TCS   :", loaded["TCS"])
