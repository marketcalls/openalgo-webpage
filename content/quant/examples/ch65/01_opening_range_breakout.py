# Opening-range breakout on NIFTY 5m: define the first 15m range, trade the break, net of costs.
import os
import time

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)


def history(symbol, exchange, interval, start, end):
    for _ in range(4):  # history() can return a transient error dict; retry
        r = client.history(symbol=symbol, exchange=exchange, interval=interval,
                           start_date=start, end_date=end)
        if hasattr(r, "index"):
            return r
        time.sleep(1)
    raise SystemExit("no data")


df = history("NIFTY", "NSE_INDEX", "5m", "2026-06-22", "2026-06-28")
day = sorted(set(df.index.date))[-1]                     # most recent trading day
d = df[df.index.date == day].copy()

# Opening range = first 15 minutes (three 5m bars: 09:15, 09:20, 09:25).
opening = d.iloc[:3]
or_high, or_low = opening["high"].max(), opening["low"].min()
width = or_high - or_low
rest = d.iloc[3:]

# Entry: first 5m bar that CLOSES beyond the range. Stop = far side of range, target = 1x range.
side = entry = entry_t = i_entry = None
for i, (t, row) in enumerate(rest.iterrows()):
    if row["close"] > or_high:
        side, entry, entry_t, i_entry = "LONG", row["close"], t, i
        break
    if row["close"] < or_low:
        side, entry, entry_t, i_entry = "SHORT", row["close"], t, i
        break

stop = or_low if side == "LONG" else or_high
target = entry + width if side == "LONG" else entry - width

# Walk the rest of the day; first touch of stop or target wins, else exit at the close.
exit_px = exit_t = reason = None
for t, row in rest.iloc[i_entry + 1:].iterrows():
    hit_stop = row["low"] <= stop if side == "LONG" else row["high"] >= stop
    hit_tgt = row["high"] >= target if side == "LONG" else row["low"] <= target
    if hit_stop:
        exit_px, exit_t, reason = stop, t, "STOP"
        break
    if hit_tgt:
        exit_px, exit_t, reason = target, t, "TARGET"
        break
if exit_px is None:
    exit_px, exit_t, reason = d["close"].iloc[-1], d.index[-1], "CLOSE"

gross_pts = (exit_px - entry) if side == "LONG" else (entry - exit_px)

# The brutal intraday cost reality: one NIFTY future lot (65), ~1 pt slippage per side, ~Rs 930 fees.
LOT, SLIP_PTS, FEES = 65, 1.0, 930.0
cost_pts = 2 * SLIP_PTS + FEES / LOT
net_pts = gross_pts - cost_pts
gross_rs, net_rs = gross_pts * LOT, net_pts * LOT

print(f"Day {day}  opening range {or_low:.2f} - {or_high:.2f}  (width {width:.1f} pts)")
print(f"{side} entry {entry:.2f} @ {entry_t.time()}   stop {stop:.2f}   target {target:.2f}")
print(f"Exit {exit_px:.2f} @ {exit_t.time()} ({reason})   gross {gross_pts:+.1f} pts = Rs {gross_rs:+,.0f}")
print(f"Cost {cost_pts:.1f} pts (slippage + fees) eats {cost_pts / gross_pts * 100:.0f}% of the move")
print(f"NET {net_pts:+.1f} pts = Rs {net_rs:+,.0f} per lot   (breakeven needs > {cost_pts:.1f} pts)")
