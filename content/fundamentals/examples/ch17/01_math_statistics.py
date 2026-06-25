# "import" brings a ready-made module into your program.
import math
import statistics

closes = [101.2, 103.5, 102.8, 104.1, 105.6]

print("Square root of 2:", round(math.sqrt(2), 4))   # reach a function with module.name
print("Pi              :", round(math.pi, 4))         # ...and constants too
print("Average close   :", statistics.mean(closes))
print("Std deviation   :", round(statistics.stdev(closes), 4))
