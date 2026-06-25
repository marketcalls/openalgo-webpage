import json

# A WebSocket subscription is just a small message you send ONCE to start a stream.
# (This only builds and prints the message - it does not open a real connection.)
subscribe = {
    "action": "subscribe",
    "mode": "ltp",
    "symbols": [
        {"symbol": "RELIANCE", "exchange": "NSE"},
        {"symbol": "TCS", "exchange": "NSE"},
    ],
}

print(json.dumps(subscribe, indent=2))
