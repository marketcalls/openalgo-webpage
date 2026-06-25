# Three ways to bring code in, each handy in different situations.
import math                            # whole module:   math.sqrt(...)
from statistics import mean, stdev     # specific names:  mean(...)
import statistics as st                # an alias:        st.variance(...)

closes = [101.2, 103.5, 102.8, 104.1, 105.6]

print("Hypotenuse:", math.hypot(3, 4))             # module.name
print("Mean      :", mean(closes))                 # imported name, used directly
print("Variance  :", round(st.variance(closes), 4))  # alias.name
