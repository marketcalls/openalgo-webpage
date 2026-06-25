# range() generates a sequence of numbers - perfect for counting.
for i in range(1, 6):          # 1, 2, 3, 4, 5  (stops just before 6)
    print(f"Lot {i}")

# A while loop repeats for as long as its condition stays True.
capital = 100000
price = 1313.60
shares = 0
while capital >= price:        # keep buying while we can still afford one
    capital -= price
    shares += 1
print(f"Bought {shares} shares, {capital:,.2f} left over.")
