from datetime import datetime, timedelta, time

# timedelta does date and time arithmetic.
close = datetime(2026, 6, 25, 15, 30)
print("Close         :", close)
print("One week later:", close + timedelta(weeks=1))
print("90 min before :", close - timedelta(minutes=90))

# Is a given moment within NSE cash hours (09:15 to 15:30, weekdays only)?
def is_market_open(dt):
    return dt.weekday() < 5 and time(9, 15) <= dt.time() <= time(15, 30)

print("11:00 Thu open?", is_market_open(datetime(2026, 6, 25, 11, 0)))   # True
print("16:00 Thu open?", is_market_open(datetime(2026, 6, 25, 16, 0)))   # False (after close)
print("11:00 Sun open?", is_market_open(datetime(2026, 6, 28, 11, 0)))   # False (weekend)
