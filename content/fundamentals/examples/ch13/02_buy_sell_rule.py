# A plain-English trading rule, written as conditions with and / or.
price = 1313.60
sma = 1305.00      # the 20-day simple moving average
rsi = 45           # a momentum gauge: above 70 = overbought, below 30 = oversold

if price > sma and rsi < 70:
    signal = "BUY"      # above the average, and not overbought
elif price < sma and rsi > 30:
    signal = "SELL"     # below the average, and not oversold
else:
    signal = "HOLD"

print("Price above average?", price > sma)
print("Signal:", signal)
