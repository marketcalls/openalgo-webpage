# Delivery equity strategies use the CNC product. Here is how CNC and MIS differ.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

product_notes = {
    "CNC": "Cash & Carry -- delivery. Shares settle into your demat; hold for days, weeks or years.",
    "MIS": "Margin Intraday Square-off -- auto-closed the same session; for day trades only.",
    "NRML": "Normal -- the carry product for F&O positions held overnight.",
}

print("Equity strategy products at a glance:")
for code, note in product_notes.items():
    print(f"  {code:5s} {note}")

print("\nA golden-cross trade may hold for months, so it MUST use product='CNC'.")
print("Using 'MIS' would square off the position automatically at the close -- wrong tool.")
