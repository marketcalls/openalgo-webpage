# Responsible automation: read OpenAlgo's real execution mode, then run a
# SEBI-style retail-algo pre-flight compliance gate in code. No orders are sent.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

# --- 1) REAL execution mode from the running OpenAlgo server ---
status = client.analyzerstatus()
data = status.get("data", {})
mode = str(data.get("mode", "unknown"))          # "analyze" (sandbox) or "live"
sandbox = bool(data.get("analyze_mode", False))
logged = data.get("total_logs", 0)
print(f"OpenAlgo execution mode : {mode.upper()}  "
      f"(sandbox={sandbox}, {logged} orders in the log)")

# --- 2) The pre-flight gate the retail framework expects every bot to pass ---
#     A registered/unique algo ID, a fixed static IP, an order rate within the
#     broker/exchange ceiling, and a wired kill switch. The exact ceiling is set
#     by the broker/exchange; 10/sec here is illustrative only.
RATE_LIMIT = 10  # orders per second

def preflight(cfg):
    return {
        "registered algo ID": bool(cfg.get("algo_id")),
        "static IP set":      bool(cfg.get("static_ip")),
        "rate within limit":  cfg.get("orders_per_sec", 0) <= RATE_LIMIT,
        "kill switch wired":  bool(cfg.get("kill_switch")),
    }

bots = {
    "mean-reversion bot": {"algo_id": "NSE-ALGO-7F3A", "static_ip": "203.0.113.24",
                           "orders_per_sec": 4, "kill_switch": True},
    "rushed scalper":     {"algo_id": "", "static_ip": "203.0.113.24",
                           "orders_per_sec": 25, "kill_switch": False},
}

print(f"\nPre-flight compliance gate (rate ceiling = {RATE_LIMIT}/sec):")
cleared = 0
for name, cfg in bots.items():
    checks = preflight(cfg)
    ok = all(checks.values())
    cleared += ok
    flags = "  ".join(f"{k}={'y' if v else 'n'}" for k, v in checks.items())
    print(f"  {name:18s} {'CLEARED' if ok else 'BLOCKED'} : {flags}")

verdict = "safe to dry-run" if sandbox else "orders would reach the broker"
print(f"\n{cleared}/{len(bots)} bots cleared the gate; server is in {mode.upper()} "
      f"mode ({verdict}).")
