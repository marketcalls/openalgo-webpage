# Writing a file: open it in "w" (write) mode, inside a with-block.
lines = ["RELIANCE,1313.60", "TCS,2109.00", "INFY,1056.60"]

with open("watchlist.txt", "w") as f:     # "w" creates the file (or overwrites it)
    for line in lines:
        f.write(line + "\n")              # write() does NOT add newlines for you

print("Wrote", len(lines), "lines to watchlist.txt")
