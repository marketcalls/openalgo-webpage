# You can RAISE your own error to reject bad input early and clearly.
def position_size(capital, price):
    if price <= 0:
        raise ValueError("price must be positive")
    return int(capital // price)

print("Shares:", position_size(100000, 1313.60))

# Trigger the bad case on purpose, and catch the message we raised.
try:
    position_size(100000, 0)
except ValueError as e:
    print("Rejected:", e)
