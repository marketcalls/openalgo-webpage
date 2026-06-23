# MCX hosts commodity futures: gold, crude oil, silver and more.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

for query in ["GOLDM", "CRUDEOIL", "SILVERM"]:
    result = client.search(query=query, exchange="MCX")
    if result["data"]:
        first = result["data"][0]
        print(f"{query:10s} -> {first['symbol']:22s} lot {first['lotsize']}")
