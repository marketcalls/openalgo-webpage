# 1) Text vs number: the same "* 3" behaves very differently.
shares_text = "50"                 # this is TEXT, not a number
shares = int(shares_text)          # convert the text into a whole number
print('"50" * 3 gives:', shares_text * 3)   # text just repeats
print(" 50  * 3 gives:", shares * 3)         # real arithmetic

# 2) Rounding money to two decimal places.
gross = 1313.60 * 1.07             # add 7 percent
print("Before rounding:", gross)
print("Rounded to 2dp :", round(gross, 2))

# 3) A famous floating-point surprise - decimals are not always exact.
print("0.1 + 0.2 =", 0.1 + 0.2)
