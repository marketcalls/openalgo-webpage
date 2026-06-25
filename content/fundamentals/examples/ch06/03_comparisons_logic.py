# Comparison operators ask a yes/no question and return True or False.
price = 1313.60
support = 1300.00
resistance = 1325.00

print("Above support?   ", price > support)       # True
print("Below resistance?", price < resistance)     # True
print("Exactly 1300?    ", price == 1300.00)       # False  (== means "equal to")

# Logical operators combine yes/no answers.
in_range = price > support and price < resistance  # both must be True
print("Inside the range?", in_range)               # True
print("Outside the range?", not in_range)          # the opposite
