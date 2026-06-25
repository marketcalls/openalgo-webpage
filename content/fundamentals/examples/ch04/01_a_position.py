# A single stock position, described entirely with variables.
symbol = "RELIANCE"       # which stock we are holding
quantity = 50             # how many shares
buy_price = 1300.00       # the price we paid per share
last_price = 1313.60      # the latest market price

# Variables can be combined in calculations, just like in algebra.
invested = quantity * buy_price          # money we put in
current_value = quantity * last_price    # what the holding is worth now
profit = current_value - invested        # unrealised profit (could be negative)

print("Position:", symbol)
print("Invested:", invested)
print("Current value:", current_value)
print("Profit:", profit)
