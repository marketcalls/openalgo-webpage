from datetime import datetime, time
from zoneinfo import ZoneInfo

ist = ZoneInfo("Asia/Kolkata")
et = ZoneInfo("America/New_York")

# One fixed moment - 11:00 on a Thursday in Mumbai - shown in two time zones.
moment = datetime(2026, 6, 25, 11, 0, tzinfo=ist)
print("Mumbai   (IST):", moment.strftime("%a %H:%M %Z"))
print("New York (ET) :", moment.astimezone(et).strftime("%a %H:%M %Z"))
print()

# NSE cash session is 09:15 to 15:30 IST, on weekdays only.
def nse_open(dt):
    dt = dt.astimezone(ist)
    return dt.weekday() < 5 and time(9, 15) <= dt.time() <= time(15, 30)

for label, m in [("Thu 11:00 IST", datetime(2026, 6, 25, 11, 0, tzinfo=ist)),
                 ("Thu 16:00 IST", datetime(2026, 6, 25, 16, 0, tzinfo=ist)),
                 ("Sun 11:00 IST", datetime(2026, 6, 28, 11, 0, tzinfo=ist))]:
    print(f"{label}: NSE open? {nse_open(m)}")
