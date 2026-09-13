import os
from dotenv import load_dotenv
from google import genai

load_dotenv("API.env")

api_key = os.getenv("GEMINI_API_KEY")
print("API Key:", api_key[:15] + "...")

client = genai.Client(api_key=api_key)

# List first few models
print("\nListing models...")
for model in client.models.list():
    print(model.name)
    break

print("\nGenerating content...")

response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents="Say hello."
)

print(response.text)