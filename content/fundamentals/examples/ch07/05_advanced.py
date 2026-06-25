from datetime import datetime

price = 1313.60
qty = 50

# The = specifier prints "expression=value" - brilliant for quick debugging.
print(f"{price=}")
print(f"{qty * price=:,.2f}")

# Dates format right inside an f-string, using strftime codes after the colon.
now = datetime(2026, 6, 25, 15, 30)
print(f"As of {now:%d %b %Y, %H:%M}")

# Leading zeros for fixed-width codes (an order id, a strike, a token).
order_id = 42
print(f"Order #{order_id:05d}")

# The width itself can come from a variable - nest braces inside the spec.
width = 12
print(f"{'Padded':>{width}}|")
