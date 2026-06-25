# if / elif / else runs the FIRST branch whose condition is True, then stops.
change_pct = 1.05      # today's percentage change

if change_pct >= 2:
    print("Big move up (2% or more)")
elif change_pct > 0:
    print("Small gain")
elif change_pct == 0:
    print("Flat - no change")
else:
    print("Down day")
