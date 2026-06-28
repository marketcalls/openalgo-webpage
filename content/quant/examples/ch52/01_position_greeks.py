# Real Black-76 Greeks for an ATM Nifty call and put, then the net Greeks of a position.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

LOT = 65  # NIFTY lot size


def greeks(symbol):
    # OpenAlgo computes Greeks with Black-76, priced off the synthetic-future FORWARD.
    r = client.optiongreeks(symbol=symbol, exchange="NFO", interest_rate=0.0,
                            underlying_symbol="NIFTY", underlying_exchange="NSE_INDEX")
    return r, r["greeks"]


c, ck = greeks("NIFTY28JUL2624200CE")
p, pk = greeks("NIFTY28JUL2624200PE")
fwd = c["spot_price"]

print(f"NIFTY 28-Jul-2026 options   forward (synthetic future) = {fwd:.2f}\n")
hdr = f"{'leg':<16}{'price':>8}{'IV%':>7}{'delta':>9}{'gamma':>11}{'vega':>9}{'theta':>9}{'rho':>9}"
print(hdr)
for name, q, k in [("ATM 24200 Call", c, ck), ("ATM 24200 Put", p, pk)]:
    print(f"{name:<16}{q['option_price']:>8.2f}{q['implied_volatility']:>7.2f}"
          f"{k['delta']:>+9.3f}{k['gamma']:>11.6f}{k['vega']:>+9.2f}{k['theta']:>+9.2f}{k['rho']:>+9.3f}")

# Position Greeks: SHORT 1 ATM straddle (sell the call and sell the put), one lot each.
n_delta = -(ck["delta"] + pk["delta"])
n_gamma = -(ck["gamma"] + pk["gamma"])
n_vega = -(ck["vega"] + pk["vega"])
n_theta = -(ck["theta"] + pk["theta"])  # short options -> positive theta (collect decay)

print("\nPosition Greeks - short 1 ATM straddle (sell call + sell put):")
print(f"  net delta  {n_delta:+.3f}      delta-neutral at inception")
print(f"  net gamma  {n_gamma:+.6f}   short gamma - any large move hurts")
print(f"  net vega   {n_vega:+.2f}      short vega - profits if IV falls")
print(f"  net theta  {n_theta:+.2f} pts/day = Rs {n_theta * LOT:,.1f}/day collected (x lot {LOT})")

print(f"\nShort ATM straddle: delta-neutral, short gamma and vega, banks "
      f"Rs {n_theta * LOT:,.1f}/day of theta - the trade is short volatility.")
