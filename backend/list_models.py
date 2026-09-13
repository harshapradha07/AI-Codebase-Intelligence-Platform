import os
from dotenv import load_dotenv
from google import genai

load_dotenv("API.env")   # or ".env" if that's where your key is

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

for model in client.models.list():
    print(model.name)