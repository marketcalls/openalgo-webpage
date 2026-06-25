# A set holds only UNIQUE items - duplicates simply vanish.
trades = ["RELIANCE", "TCS", "RELIANCE", "INFY", "TCS", "RELIANCE"]
unique = set(trades)                  # turn the list into a set

print("Raw trades   :", len(trades))            # 6 trades...
print("Unique count :", len(unique))            # ...in only 3 names
print("Unique names :", sorted(unique))         # a set has no order, so we sort to print

# Membership tests on a set are instant - ideal for "have I seen this?"
print("Traded INFY? ", "INFY" in unique)        # True
print("Traded HDFC? ", "HDFCBANK" in unique)    # False
