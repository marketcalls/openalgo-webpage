# "a" (append) mode adds to the end without erasing what is already there.
with open("watchlist.txt", "a") as f:
    f.write("HDFCBANK,1642.40\n")

# Read it back to confirm the new line joined the others.
with open("watchlist.txt") as f:
    print(f.read())
