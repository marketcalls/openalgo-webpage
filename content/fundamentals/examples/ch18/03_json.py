import json

quote = {"symbol": "RELIANCE", "ltp": 1313.60, "change": 13.60}

# dumps: a Python dictionary -> a JSON text string (how APIs send data).
text = json.dumps(quote)
print("As JSON text:", text)

# loads: JSON text -> back into a Python dictionary you can use.
back = json.loads(text)
print("Back to dict:", back["ltp"])
