# Best practice: keep secrets in a .env file and load them with python-dotenv.
import os

from dotenv import load_dotenv

from openalgo import api

load_dotenv()  # reads a .env file in this folder into the environment

api_key = os.getenv("OPENALGO_API_KEY", "your_api_key_here")
client = api(api_key=api_key, host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"))

print("Loaded key ending in:", api_key[-4:])
print("Connected:", client.analyzerstatus()["status"] == "success")
