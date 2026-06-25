# Messy text in, tidy text out. Methods are attached with a dot.
raw = "  reliance  "
clean = raw.strip().upper()           # strip removes outer spaces, upper capitalises
print("Cleaned:", repr(clean))        # repr shows the quotes, proving spaces are gone

# Checking what a string contains.
symbol = "NSE:RELIANCE"
print("Starts with NSE? ", symbol.startswith("NSE"))   # True
print("Contains a colon?", ":" in symbol)              # True

# Replacing part of a string (it returns a NEW string).
print("Swap exchange   :", symbol.replace("NSE", "BSE"))  # BSE:RELIANCE
