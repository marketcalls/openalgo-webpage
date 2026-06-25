# Guard clauses: check the bad cases first and reject early, so the
# "happy path" at the end runs only when everything is in order.
capital = 100000
price = 1313.60
quantity = 50

cost = price * quantity

if quantity <= 0:
    print("Reject: quantity must be positive.")
elif cost > capital:
    print(f"Reject: need {cost:,.0f} but only have {capital:,.0f}.")
else:
    print(f"Order OK: {quantity} shares for {cost:,.2f}. Cash left {capital - cost:,.2f}.")
