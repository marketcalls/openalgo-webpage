# A tuple groups values together with round brackets - and then locks them.
bar = (1300.0, 1318.4, 1297.2, 1313.6)   # open, high, low, close

print("The bar :", bar)
print("Open    :", bar[0])      # index it just like a list
print("Close   :", bar[-1])
print("Type    :", type(bar).__name__)

# Tuples are immutable - trying to change one raises an error (caught here safely).
try:
    bar[0] = 1305.0
except TypeError as e:
    print("Cannot change:", e)
