import random

random.seed(42)        # seeding makes the "random" results reproducible

# Simulate 5 days of a price taking a random walk of +/- up to 1% a day.
price = 100.0
for day in range(1, 6):
    move = random.uniform(-1, 1)         # a random percentage move
    price = price * (1 + move / 100)
    print(f"Day {day}: move {move:+.2f}%  ->  price {price:.2f}")
