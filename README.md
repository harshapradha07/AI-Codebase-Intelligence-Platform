# 🧠 AI Codebase Intelligence Platform

An AI-powered platform designed to analyze software repositories and provide intelligent insights into codebases. The platform combines a React-based frontend with a FastAPI backend and Groq-powered AI capabilities to help developers understand, analyze, and interact with their code.

## 🚀 Overview

The **AI Codebase Intelligence Platform** is designed to make large and complex codebases easier to understand.

Instead of manually exploring files and dependencies, developers can use the platform to analyze a repository and interact with the codebase through an AI-powered interface.

### Key Capabilities

* 📂 Repository analysis
* 🤖 AI-powered code assistance
* 💬 Interactive codebase chat
* 🏗️ Architecture visualization
* 🔗 Dependency analysis
* 🔍 Code review assistance
* 🛡️ Security findings
* 📊 Repository statistics

## 🛠️ Technology Stack

### Frontend

* React
* JavaScript
* Vite
* HTML
* CSS

### Backend

* Python
* FastAPI
* Uvicorn

### AI

* Groq API

### Development Tools

* Git
* GitHub
* Visual Studio Code
* Python Virtual Environment
* npm

## 📁 Project Structure

```text
AI-Codebase-Intelligence-Platform/
│
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── utils/
│   ├── main.py
│   ├── requirements.txt
│   └── ...
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── data/
│   ├── App.jsx
│   └── main.jsx
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── .gitignore
```

## ⚙️ Prerequisites

Before running the project, install:

* Windows 10/11
* Python 3.10 or later
* Node.js LTS
* Git
* Visual Studio Code (recommended)

Verify the installations:

```bash
python --version
node -v
npm -v
git --version
```

## 📥 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/harshapradha07/AI-Codebase-Intelligence-Platform.git
```

Move into the project directory:

```bash
cd AI-Codebase-Intelligence-Platform
```

## 🔧 Backend Setup

Open a terminal and navigate to the backend:

```bash
cd backend
```

Create a Python virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

After successful activation, `(venv)` will appear in the terminal.

Install the required Python packages:

```bash
pip install -r requirements.txt
```

### 🔑 Configure Groq API

Create a file named:

```text
API.env
```

inside the `backend` folder.

Add your Groq API key:

```env
GROQ_API_KEY=YOUR_GROQ_API_KEY
```

**Do not commit your API key to GitHub.**

Start the FastAPI backend:

```bash
python -m uvicorn main:app --reload --port 8002
```

The backend should run at:

```text
http://127.0.0.1:8002
```

Keep this terminal running.

## 💻 Frontend Setup

Open a **second terminal** and return to the project root:

```bash
cd AI-Codebase-Intelligence-Platform
```

Install the Node.js dependencies:

```bash
npm install
```

Start the React/Vite development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

Open the URL in your browser.

## 🔄 Application Flow

The platform uses a frontend-backend architecture:

```text
User
  │
  ▼
React / Vite Frontend
  │
  │ API Request
  ▼
FastAPI Backend
  │
  ▼
Groq API
  │
  ▼
AI Response
  │
  ▼
React Frontend
  │
  ▼
User
```

When a user asks a question through the chat interface, the frontend sends the request to the FastAPI backend. The backend processes the request and communicates with the Groq API. The generated response is then returned and displayed in the frontend.

## 🌐 Running Services

Both services need to run simultaneously.

| Service  | URL                     |
| -------- | ----------------------- |
| Frontend | `http://localhost:5173` |
| Backend  | `http://127.0.0.1:8002` |

## 🧪 Running the Application

### Terminal 1 — Backend

```bash
cd backend
venv\Scripts\activate
python -m uvicorn main:app --reload --port 8002
```

### Terminal 2 — Frontend

```bash
npm install
npm run dev
```

Then open:

```text
http://localhost:5173
```

You can interact with the AI assistant through the chat interface.

## 🐛 Troubleshooting

### Python is not recognized

Install Python and make sure it is added to the system PATH.

### npm is not recognized

Install the Node.js LTS version.

### Missing Python packages

Run:

```bash
pip install -r requirements.txt
```

### Frontend cannot connect to backend

Check that:

1. The backend is running on port `8002`.
2. The frontend API URL is configured correctly.
3. `API.env` contains a valid `GROQ_API_KEY`.

### Port already in use

Stop the process using the port or select another port and update the frontend configuration accordingly.

## 🔐 Security

Never upload sensitive credentials to GitHub.

Make sure files containing API keys, passwords, or other secrets are excluded using `.gitignore`.

For example:

```gitignore
API.env
.env
.env.*
```

## 🔮 Future Improvements

Potential improvements for the platform include:

* Advanced codebase semantic search
* Improved repository indexing
* More detailed dependency analysis
* Enhanced security vulnerability detection
* Automated code quality recommendations
* More advanced architecture visualization
* Production deployment support
* Support for additional AI models

## 👩‍💻 Author

**Harshapradha Kundan**

Computer Science and Engineering (Cybersecurity)
AI/ML | Generative AI | Cybersecurity | Software Development

## 📄 License

This project is intended for educational, research, and development purposes.
