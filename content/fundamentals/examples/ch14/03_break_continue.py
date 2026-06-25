prices = [101.2, 103.5, 99.8, 104.1, 98.5, 106.3]
alert_level = 105.0

# continue = skip the rest of THIS turn; break = stop the loop entirely.
for price in prices:
    if price < 100:
        continue                  # ignore sub-100 prices, jump to the next
    print("Checking", price)
    if price > alert_level:
        print("Alert! Price broke", alert_level)
        break                     # found it - no need to look further
