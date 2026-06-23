# Build a clean, human-readable order summary with an f-string.
symbol = "RELIANCE"
action = "BUY"
qty = 50
price = 1309.5

summary = f"{action} {qty} x {symbol} @ {price:.2f}  =  Rs.{qty * price:,.2f}"
print(summary)

# A few handy string methods you will use on symbols and exchanges:
print(symbol.lower(), "|", action.title(), "|", "nfo".upper())
