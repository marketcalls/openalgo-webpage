# A function packages a calculation under a name, so you can reuse it.
def percentage_change(old, new):
    return (new - old) / old * 100      # "return" hands the answer back

# Define it once, then call it as often as you like with different inputs.
print("RELIANCE:", round(percentage_change(1300, 1313.60), 2), "%")
print("TCS     :", round(percentage_change(2120, 2109.00), 2), "%")
print("INFY    :", round(percentage_change(1050, 1056.60), 2), "%")
