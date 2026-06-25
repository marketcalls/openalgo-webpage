import numpy as np

closes = np.array([291.58, 295.63, 291.13, 296.42, 299.24,
                   295.95, 298.01, 297.01, 294.30, 293.08])

# Vectorised maths: one expression acts on the WHOLE array at once - no loop.
change = closes - closes[0]                # change vs day 1, for every day
print("Change vs day 1:", change.round(2))

# Daily percentage returns, for all days, in a single line.
returns = (closes[1:] - closes[:-1]) / closes[:-1] * 100
print("Daily returns %:", returns.round(2))
print("Average return :", round(returns.mean(), 3), "%")
print("Best day       :", round(returns.max(), 2), "%")
