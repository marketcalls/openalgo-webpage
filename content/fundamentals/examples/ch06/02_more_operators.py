# Three more operators worth knowing, each with a trading use.
capital = 100000
cost_per_lot = 65680

print("Whole lots affordable:", capital // cost_per_lot)   # // floor division
print("Cash left over       :", capital % cost_per_lot)    # %  remainder
print("1% a day for 5 days  :", round((1.01 ** 5 - 1) * 100, 2), "%")  # ** power

# Operator precedence: * and / happen before + and - (just like school maths).
print("1000 + 50 * 2   =", 1000 + 50 * 2)        # 1100, not 2100
print("(1000 + 50) * 2 =", (1000 + 50) * 2)      # 2100 - parentheses win
