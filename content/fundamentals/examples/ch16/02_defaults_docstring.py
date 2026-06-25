def brokerage(turnover, rate=0.0003, cap=20.0):
    """Return the brokerage on a trade: a rate of turnover, capped at `cap` rupees."""
    return round(min(turnover * rate, cap), 2)    # round to paise

# rate and cap have DEFAULTS, so you can leave them out...
print("Small trade:", brokerage(10000))             # 0.0003 * 10000 = 3.0
print("Large trade:", brokerage(500000))            # would be 150, but capped at 20
# ...or override them by name.
print("Custom rate:", brokerage(10000, rate=0.001))  # 10.0

# A docstring documents the function and is readable via .__doc__
print("Docs       :", brokerage.__doc__)
