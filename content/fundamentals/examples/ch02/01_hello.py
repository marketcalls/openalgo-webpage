# Your very first Python program.
# Save it as hello.py, then run it from a terminal with:  python hello.py
import sys

print("Hello, markets! Python is working.")
print("You are running Python version", sys.version.split()[0])

# Python is also a calculator. A quick profit check on one share:
buy_price = 100.0
sell_price = 105.5
profit = sell_price - buy_price
print(f"Bought at {buy_price}, sold at {sell_price}, profit of {profit} per share.")
