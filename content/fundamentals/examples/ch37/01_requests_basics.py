import requests

# A GET request fetches data from a URL. httpbin.org is a free testing service.
resp = requests.get("https://httpbin.org/json", timeout=10)

print("Status code  :", resp.status_code)             # 200 means OK
print("Content type :", resp.headers["Content-Type"])  # tells us it's JSON
data = resp.json()                                     # parse the JSON body -> a dict
print("Top-level keys:", list(data.keys()))
