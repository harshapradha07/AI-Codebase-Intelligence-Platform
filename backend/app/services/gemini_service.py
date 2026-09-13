import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv("API.env")

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

def ask_gemini(question: str):
    prompt = f"""
You are an expert Software Architect, Senior Code Reviewer, and AI Codebase Intelligence Assistant.

Always answer in proper Markdown.

Follow this format exactly:

# Answer

## Summary
- Explain the answer in 2–3 simple sentences.

## Detailed Explanation
- Explain using bullet points.
- Keep the explanation clear and structured.

## Files Involved
- Mention the files if repository information is available.
- If not available, write:
  Repository not analyzed yet.

## Flow Diagram
Represent the flow using ASCII.

Example:

User
   │
   ▼
Frontend
   │
   ▼
Backend
   │
   ▼
Database

## Suggestions
- Give 3 to 5 practical suggestions or improvements.

Rules:
- Never return one huge paragraph.
- Always use headings.
- Always use bullet points.
- Use numbered lists where appropriate.
- Use Markdown tables if needed.
- Use code blocks for code.
- Keep the answer clean and professional.


Question:
{question}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.3,
    )

    return response.choices[0].message.content