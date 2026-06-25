from datetime import date, timedelta

# A fixed date keeps this example's output stable (use date.today() for "now").
today = date(2026, 6, 25)

print("Date      :", today)
print("Day name  :", today.strftime("%A"))      # the weekday, spelled out
print("In 7 days :", today + timedelta(days=7))  # date maths with timedelta
print("Year      :", today.year)
