# input() pauses and waits for the user to type, then returns what they typed.
# IMPORTANT: it always returns TEXT (a str), even when they type digits.
quantity_text = input("How many shares do you hold? ")
quantity = int(quantity_text)          # convert text -> number before any maths

price = 1313.60
print()
print(f"You typed {quantity_text!r}, which is a {type(quantity_text).__name__}.")
print(f"As a number that is {quantity}.")
print(f"Position value: {quantity * price:,.2f}")
