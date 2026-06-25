closes = [101.2, 103.5, 99.8, 104.1, 98.5, 106.3]

# Add an "if" to the end to KEEP only the items that pass a test.
above_100 = [c for c in closes if c > 100]
print("Above 100:", above_100)

# Transform AND filter together: round only the prices above 104.
strong = [round(c, 1) for c in closes if c > 104]
print("Strong   :", strong)
