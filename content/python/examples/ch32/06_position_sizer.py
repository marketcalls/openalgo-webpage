# A reusable sizer: rupee risk in, whole-lot quantity out - safe for F&O.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)


def position_size(capital, risk_pct, entry, stop, lot_size=1):
    """Whole-lot quantity that risks at most risk_pct of capital down to the stop."""
    per_unit = abs(entry - stop)
    if per_unit == 0:
        return 0
    risk_amount = capital * risk_pct / 100
    units = risk_amount // per_unit
    lots = int(units // lot_size)            # round DOWN to whole lots
    return lots * lot_size


capital = float(client.funds()["data"]["availablecash"])

# Equity: 1 share = 1 unit
eq = position_size(capital, 1.0, entry=1400, stop=1372, lot_size=1)
print(f"RELIANCE equity   -> qty {eq}   (risk {eq * 28:,.2f})")

# Futures must trade in lots (NIFTY lot = 65 from Chapter 3)
fut = position_size(capital, 1.0, entry=25900, stop=25750, lot_size=65)
print(f"NIFTY fut lot=65  -> qty {fut}   ({fut // 65} lot/s, risk {fut * 150:,.2f})")
print("\nSame 1% rule everywhere - the lot rounding just keeps F&O orders valid.")
