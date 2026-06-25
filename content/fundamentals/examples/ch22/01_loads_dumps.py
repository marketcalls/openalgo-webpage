import json

# A JSON string - exactly the kind of text a market API sends back.
text = '{"symbol": "RELIANCE", "ltp": 1313.60, "exchange": "NSE"}'

quote = json.loads(text)              # JSON text -> Python dict
print("Price:", quote["ltp"])
print("Type :", type(quote).__name__)

# The other direction, with indent= for a human-readable layout.
nice = json.dumps(quote, indent=2)
print(nice)
