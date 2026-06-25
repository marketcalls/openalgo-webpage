from datetime import datetime

dt = datetime(2026, 6, 25, 15, 30)

# strftime: a datetime -> formatted TEXT   (f = format)
print("ISO date  :", dt.strftime("%Y-%m-%d"))
print("Readable  :", dt.strftime("%d %b %Y, %I:%M %p"))
print("Day & time:", dt.strftime("%A %H:%M"))

# strptime: TEXT -> a datetime   (p = parse)
text = "2026-06-25 09:15"
parsed = datetime.strptime(text, "%Y-%m-%d %H:%M")
print("Parsed    :", parsed, "| type:", type(parsed).__name__)
