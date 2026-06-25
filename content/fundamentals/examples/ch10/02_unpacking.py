# Unpacking hands each value in a tuple its own name, in a single line.
bar = (1300.0, 1318.4, 1297.2, 1313.6)
open_, high, low, close = bar     # note: open_ avoids clashing with Python's open()

print("High :", high, " Low:", low)
print("Range:", round(high - low, 2))

# A neat side effect: swap two variables with no temporary holder.
support, resistance = 1300.0, 1325.0
support, resistance = resistance, support   # swapped in one line
print("After swap -> support:", support, "resistance:", resistance)
