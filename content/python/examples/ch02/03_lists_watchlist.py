# A watchlist is just a list. Index it, slice it, grow it, loop over it.
watchlist = ["RELIANCE", "TCS", "INFY", "SBIN"]

print("First symbol :", watchlist[0])
print("Last symbol  :", watchlist[-1])
print("First two    :", watchlist[:2])

watchlist.append("HDFCBANK")  # add a symbol
print("How many     :", len(watchlist))

for i, sym in enumerate(watchlist, start=1):
    print(i, sym)
