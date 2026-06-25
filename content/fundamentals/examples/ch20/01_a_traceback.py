# This script crashes ON PURPOSE, to show what a traceback looks like.
prices = [101.2, 103.5, 102.8]


def average(values):
    return sum(values) / len(values)


print("Average:", average(prices))   # this line works fine...
print("Bad call:", average([]))      # ...this one divides by len([]) == 0
