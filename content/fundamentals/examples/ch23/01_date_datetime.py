from datetime import date, datetime

d = date(2026, 6, 25)                     # a calendar date
dt = datetime(2026, 6, 25, 15, 30, 0)     # a date AND a time (3:30 PM, market close)

print("Date     :", d)
print("Datetime :", dt)
print("Parts    : year", d.year, "month", d.month, "day", d.day)
print("Time     : hour", dt.hour, "minute", dt.minute)
print("Weekday  :", d.strftime("%A"))     # the day name
