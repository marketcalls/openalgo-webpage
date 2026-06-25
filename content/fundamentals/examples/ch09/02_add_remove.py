# Lists can grow and shrink - perfect for a changing watchlist.
watchlist = ["RELIANCE", "TCS", "INFY"]

watchlist.append("HDFCBANK")     # add to the end
watchlist.insert(0, "NIFTY")     # add at a specific position (the front)
print("After adding :", watchlist)

watchlist.remove("TCS")          # remove the first matching value
last = watchlist.pop()           # remove AND return the last item
print("Popped off   :", last)
print("Final list   :", watchlist)
