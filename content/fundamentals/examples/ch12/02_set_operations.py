# Two watchlists, compared with real set maths.
mine = {"RELIANCE", "TCS", "INFY", "HDFCBANK"}
friend = {"INFY", "HDFCBANK", "ITC", "SBIN"}

print("In both (intersection):", sorted(mine & friend))   # &  shared by both
print("Either list (union)   :", sorted(mine | friend))   # |  everything, once
print("Only mine (difference):", sorted(mine - friend))   # -  in mine, not theirs
