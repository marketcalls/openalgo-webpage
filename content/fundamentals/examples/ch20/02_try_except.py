# try/except lets your program survive an error instead of crashing.
def safe_average(values):
    try:
        return sum(values) / len(values)
    except ZeroDivisionError:
        return 0.0                       # a sensible fallback for an empty list

print("Normal:", safe_average([101.2, 103.5, 102.8]))
print("Empty :", safe_average([]))       # no crash this time

# Catching a different error - text that isn't a number.
for text in ["50", "fifty", "75"]:
    try:
        print(f"{text!r} -> {int(text)}")
    except ValueError:
        print(f"{text!r} -> not a number, skipping")
