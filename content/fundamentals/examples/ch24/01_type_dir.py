# Stuck on a mystery value? Ask Python what it is and what it can do.
prices = [101.2, 103.5, 102.8]

print("What is it?  ", type(prices).__name__)      # list

# dir() lists the methods - the verbs you can use on it.
# We hide the __dunder__ names to see just the useful ones.
methods = [m for m in dir(prices) if not m.startswith("__")]
print("What can it do?", methods)
