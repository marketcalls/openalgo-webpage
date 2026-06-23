# The MIS product: intraday margin orders that auto-square-off before the close.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

# product="MIS" tells the broker this is an intraday trade. It gives extra leverage
# but the position is force-closed near the session close. We use an MCX commodity
# future here because MCX trades into the evening, so this MIS order is accepted
# even after the equity market has shut. (Server is in analyze mode -- it is simulated.)
resp = client.placeorder(
    strategy="Intraday ORB",
    symbol="GOLDM03JUL26FUT",
    action="BUY",
    exchange="MCX",
    price_type="MARKET",
    product="MIS",      # MIS = intraday;  CNC = delivery;  NRML = F&O carry
    quantity=1,
)

print("Order status:", resp.get("status"))
print("Order id     :", resp.get("orderid"))
print("\nProduct codes you will use intraday:")
print("  MIS  -> intraday, higher leverage, auto square-off (this strategy)")
print("  CNC  -> delivery / overnight equity")
print("  NRML -> futures & options carried overnight")
print("\nNote: equity MIS orders are blocked after 15:15 IST -- the broker enforces square-off for you.")
