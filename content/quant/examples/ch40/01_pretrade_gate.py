# Pre-trade risk gate: check proposed orders against position, loss and rate limits.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

# --- REAL quote drives sizing: position VALUE = shares * live LTP ---
q = client.quotes(symbol="RELIANCE", exchange="NSE")["data"]
ltp = q["ltp"]

# --- risk policy (the numbers a desk would set up front) ---
MAX_POSITION_VALUE = 20_00_000   # rupees of gross exposure allowed in this symbol
DAILY_LOSS_LIMIT = 25_000        # rupees; breaching this trips the kill switch
RATE_LIMIT_N = 4                 # at most N accepted orders ...
RATE_WINDOW_S = 10               # ... per rolling window of this many seconds


class RiskGate:
    def __init__(self, ltp):
        self.ltp = ltp
        self.position = 0          # net shares currently held
        self.sent = []             # timestamps (s) of orders the gate accepted
        self.killed = False        # latches True once the loss switch trips

    def check(self, side, qty, now, day_pnl):
        sign = 1 if side == "BUY" else -1
        new_pos = self.position + sign * qty
        # GATE 1 - loss / kill switch (checked first, and it latches)
        if self.killed or day_pnl <= -DAILY_LOSS_LIMIT:
            self.killed = True
            return False, "kill switch - daily loss limit"
        # GATE 2 - position cap, sized off the REAL ltp
        value = abs(new_pos) * self.ltp
        if value > MAX_POSITION_VALUE:
            return False, f"position cap (Rs {value:,.0f})"
        # GATE 3 - rate / throttle limit
        recent = [t for t in self.sent if now - t < RATE_WINDOW_S]
        if len(recent) >= RATE_LIMIT_N:
            return False, f"rate limit ({RATE_LIMIT_N}/{RATE_WINDOW_S}s)"
        self.position = new_pos     # all gates passed - commit the order
        self.sent.append(now)
        return True, f"accepted, pos -> {new_pos}"


# proposed orders walking through a session: (t_seconds, side, qty, running_day_pnl)
tests = [
    (0,  "BUY",  500,    0),
    (1,  "BUY",  500,  2000),
    (2,  "BUY",  600,  1500),   # would push exposure over the position cap
    (3,  "BUY",  400,  -500),
    (4,  "BUY",  100,  -300),
    (5,  "SELL", 200,  -200),   # 5th order inside 10s -> throttled
    (18, "BUY",  200, -26000),  # day P&L now below the loss limit -> kill
    (20, "BUY",  100, -26000),  # switch has latched, stays blocked
]

gate = RiskGate(ltp)
print(f"RELIANCE LTP Rs {ltp:.2f} | caps: exposure <= Rs {MAX_POSITION_VALUE:,}, "
      f"loss <= Rs {DAILY_LOSS_LIMIT:,}, rate <= {RATE_LIMIT_N}/{RATE_WINDOW_S}s\n")
print(" t  order      day_pnl   result   reason")
passed = 0
for t, side, qty, pnl in tests:
    ok, why = gate.check(side, qty, t, pnl)
    passed += ok
    print(f"{t:2d}  {side:4s} {qty:4d}  {pnl:8d}   {'PASS ' if ok else 'BLOCK'}   {why}")

print(f"\n{passed} of {len(tests)} proposed orders passed the gate; final position "
      f"{gate.position} shares; kill switch {'TRIPPED' if gate.killed else 'armed'}.")
