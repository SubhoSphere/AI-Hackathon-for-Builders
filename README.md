# ⚡ AI-Powered Code Review Assistant

> **Accelerate Developer Velocity. Fortify Your Codebase. Automate QA.**
> An elite, AI-driven Staff Engineer that reviews your Pull Requests in milliseconds.

**Hackathon:** AI Hackathon for Builders  
**Team:** NeuralSpark  
**Members:** Subhajit Mandal, Aviraj Seal  

---

## 🛑 The Core Problem

Engineering teams are constantly battling a severe operational bottleneck: **Manual Pull Request Reviews**.

- **Time Drain:** Senior developers spend countless hours painstakingly reviewing PRs, draining time from actual feature development.
- **Human Error:** Fatigue and context-switching mean that critical vulnerabilities, subtle logical bugs, and performance regressions inevitably slip into production.
- **Inconsistent Standards:** Code smells and architectural anti-patterns often go unnoticed unless heavily policed by strict (and slow) human oversight.

The result? Slower release cycles, increased technical debt, and a higher risk of security breaches.

---

## 🚀 The Solution & Features

**AI-Powered Code Review Assistant** is an intelligent, automated QA agent that integrates directly into your GitHub workflow. Powered by Google's Gemini 2.5 Pro model, it acts as an elite Staff Security and Software Engineer, rigorously auditing your code in real-time.

### ✨ Key Features

- **Real-Time Diff Processing:** Instantly fetches and parses raw Git diffs from any public GitHub repository. No complex webhooks required.
- **Structured Engineering Taxonomy:** The AI doesn't just chat; it categorizes every finding into a strict, actionable schema:
  - 🛡️ **SECURITY:** Identifies vulnerabilities (XSS, Injection, Auth flaws).
  - ⚡ **PERFORMANCE:** Highlights bottlenecks and non-performant queries.
  - 🐛 **BUG:** Catches logic errors and edge cases before they merge.
  - 💡 **CODE SMELL:** Enforces clean code principles and architectural best practices.
- **Dynamic Repo Health Scoring:** Calculates a live "Health Score" for every PR based on the severity and frequency of findings (deducting heavily for CRITICAL flaws).
- **"One-Click Apply Fix" Emulator:** Every issue comes with a beautifully formatted Markdown code block offering a concrete fix, complete with an interactive "Apply Fix to Codebase" action.

---

## 🛠️ Tech Stack & Implementation

We built a high-fidelity, high-performance architecture optimized for speed and developer experience (DX).

### Frontend Architecture
- **Framework:** Next.js 16 (App Router)
- **Library:** React 19
- **Styling:** Tailwind CSS v4 (Custom Dark Mode: Zinc/Slate aesthetic)
- **Icons:** Lucide React
- **Rendering:** React Markdown (for safe, syntax-highlighted code block rendering)

### Core Backend Engines
- **Data Ingestion:** GitHub REST API (Diff Extraction)
- **AI Processing:** Google Generative AI SDK (`@google/generative-ai`)
- **LLM Engine:** Gemini 2.5 Pro (`gemini-2.5-pro` model with strict JSON Schema enforcement)

---

## 🗺️ System Workflow Diagram

```text
[ Developer creates PR ]
           │
           ▼
┌──────────────────────────┐      1. Input Repo URL & PR Number
│  Next.js Client UI       ├─────────────────────────────────┐
│  (Dashboard / Arena)     │                                 │
└──────────┬───────────────┘                                 ▼
           │                                      ┌─────────────────────┐
           │ 4. Renders Split-Pane                │ Next.js API Routes  │
           │    Dashboard & Feed                  │ (/api/github)       │
           ▼                                      │ (/api/review)       │
┌──────────────────────────┐                      └──────────┬──────────┘
│  Review Arena Component  │                                 │
│  - Raw Diff Viewer       │◄────────────────────────────────┤
│  - AI Annotation Cards   │   3. Returns Structured JSON    │ 2. Extracts Diff &
└──────────────────────────┘      (Severity, Fix, Line #)    │    Prompts LLM
                                                             ▼
                                                ┌─────────────────────────┐
                                                │  Google Gemini 2.5 Pro  │
                                                │  (System Prompt + Diff) │
                                                └─────────────────────────┘
```

---

## ⚙️ Local Installation Blueprint

Want to run the AI Code Review Assistant locally? Follow these exact steps:

### 1. Clone the Repository

```bash
git clone https://github.com/SubhoSphere/AI-Hackathon-for-Builders.git
cd AI-Hackathon-for-Builders/frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root of the `frontend` directory:

```bash
touch .env.local
```

Add the following schema to your `.env.local` file:

```env
# GitHub Personal Access Token (Required for higher rate limits and accessing raw diffs)
GITHUB_TOKEN=your_github_personal_access_token_here

# Google Gemini API Key (Required for the AI Review Engine)
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Ignite the Development Server

```bash
npm run dev
```

Navigate to `http://localhost:3000` to enter the AI Review Arena. Paste a public GitHub repo URL and let the agent do the heavy lifting!

---

*Built with passion for the AI Hackathon for Builders.* 🚀
