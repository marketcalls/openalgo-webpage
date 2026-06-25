# When you are unsure what a function gives back, capture it and inspect it.
text = "RELIANCE,TCS,INFY"
result = text.split(",")

print("Result     :", result)
print("Type        :", type(result).__name__)
print("How many    :", len(result))
print("First item  :", result[0], "->", type(result[0]).__name__)
