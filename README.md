# SmartStudy AI – Intelligent Student Copilot 🎓✨

**SmartStudy AI** is a complete, modern, AI-powered student utility web application designed to help students study smarter, retain concepts faster, and score higher on exams.

It features a polished React dashboard with an attractive **Blue, Purple, and White** color theme, connected to a secure **Python Flask** backend powered by the official **Google Gen AI SDK** (`google-genai`).

---

## 🚀 Key Features & AI Workflows

### 1. 📝 Notes Summarizer
- **Purpose**: Condenses lengthy, complex lecture notes or textbook chapters into structured, high-retention briefs.
- **AI Instructions**: Summarizes notes in simple English, extracts important concepts, formats key points in bullets, includes important definitions, highlights exam-oriented focus areas, and strictly avoids ungrounded claims.
- **Output Sections**:
  - **Short Summary**: Concise executive summary of the notes.
  - **Important Points**: Bulleted list of core concepts.
  - **Key Definitions**: Essential terms and definitions extracted from the text.
  - **Exam Highlights**: High-yield exam focus areas and potential pitfalls.
- **Controls**: Word/character counters, 1-click Markdown copy button, and sample presets.

### 2. 🎯 Quiz Generator & Interactive Player
- **Purpose**: Active recall testing generated directly from student notes.
- **AI Instructions**: Generates exactly 5 multiple-choice questions with 4 distinct options, exactly 1 correct answer (index 0-3), and detailed pedagogical explanations grounded strictly in the provided material.
- **Interactive Quiz Player**:
  - Step-by-step single question view with progress tracking.
  - Immediate visual feedback on selection (emerald for correct, rose for incorrect).
  - Pedagogical explanation card explaining why the answer is correct.
  - Score tracking and celebration confetti upon completion.
  - **Restart Quiz** button to reset and practice again.
  - **Study Sheet View**: Full printable layout with answer key and 1-click copy.

### 3. 🚀 Answer Improver
- **Purpose**: Elevates rough, basic, or poorly structured student draft answers into high-scoring model answers.
- **AI Instructions**: Corrects grammar and spelling, improves sentence structure, uses clear academic English, organizes with suitable headings/points, preserves original meaning, adds relevant details, and avoids pretentious vocabulary.
- **Output Sections**:
  - **Improved Answer**: Polished, well-structured response with clear headings and paragraphs.
  - **Important Points**: Bulleted list of core arguments and concepts established in the answer.
  - **Suggested Improvements**: Clear breakdown of grammar, organization, and academic clarity enhancements.
  - **Score Uplift**: Visual assessment banner (e.g. `5/10 → 9.5/10`) and grade level elevation.
  - **Draft vs. Model Answer Comparison**: Side-by-side or tabbed comparison view.
  - **1-Click Copy**: Fast copying of the improved model answer.

### 4. 💡 Concept Explainer (Feynman Technique)
- **Purpose**: Demystifies intimidating, abstract theories using analogies, simple steps, and practical applications.
- **AI Instructions**: Explains concepts in beginner-friendly English, breaks difficult ideas into simple sequential steps, includes concrete real-world examples, defines important terminology, and provides a quick revision summary.
- **Output Sections**:
  - **Simple Explanation**: Intuitive, everyday explanation free of unnecessary jargon.
  - **The Everyday Analogy**: Memorable real-world analogy (e.g. Byzantine Generals for Blockchain consensus).
  - **Step-by-Step Understanding**: Sequential breakdown cards.
  - **Real-World Example**: Practical scenario and industrial application.
  - **Important Terms**: Key vocabulary terms with definitions.
  - **Quick Revision Summary**: High-impact recap for last-minute exam review.
  - **1-Click Copy**: Export full concept brief.

---

## 📂 Project Structure

```
smartstudy-ai/
├── backend/
│   ├── app.py                      # Flask REST API endpoints & input validation
│   ├── prompts.py                  # 5-part prompt engineering templates & JSON schemas
│   ├── sample_data.py              # Sample notes and test presets
│   ├── requirements.txt            # Python dependencies (google-genai, flask, etc.)
│   ├── .env.example                # Template configuration with placeholder
│   ├── .env                        # Local backend environment file (contains GEMINI_API_KEY)
│   ├── .gitignore                  # Ignores .env and python cache
│   └── services/
│       └── gemini_service.py       # Official Google Gen AI SDK integration & error handling
├── frontend/
│   ├── package.json                # React 19, Tailwind CSS, Lucide dependencies
│   ├── vite.config.js              # Vite server configuration with API proxy (/api -> 5000)
│   ├── index.html                  # HTML entry point with metadata and fonts
│   └── src/
│       ├── main.jsx                # React mount entry
│       ├── App.jsx                 # Main state, tab navigation, and footer
│       ├── index.css               # Tailwind CSS styles and theme variables
│       ├── services/
│       │   └── api.js              # Frontend API client (no secrets exposed)
│       └── components/
│           ├── Navbar.jsx          # Header navigation, branding, and status badges
│           ├── Dashboard.jsx       # Overview, tool launch cards, and study tips
│           ├── NotesSummarizer.jsx # Dedicated notes summarization workflow
│           ├── QuizGenerator.jsx   # Interactive 5-MCQ quiz taker & study sheet
│           ├── AnswerImprover.jsx  # Exam answer elevation & comparison workflow
│           ├── ConceptExplainer.jsx# Feynman concept explainer workflow
│           ├── ApiKeyModal.jsx     # AI engine & environment status modal
│           └── Toast.jsx           # Floating notification toast
├── .gitignore                      # Root gitignore
├── start_backend.bat               # Windows one-click backend launcher
├── start_frontend.bat              # Windows one-click frontend launcher
└── README.md                       # Comprehensive documentation
```

---

## 🔑 How to Enter Your Gemini API Key

> [!IMPORTANT]
> **API Key Security**: For strict security compliance, your Google Gemini API key is **never** hardcoded, **never** exposed in frontend JavaScript, and **never** transmitted to the browser. It is read strictly by the Python backend via environment variables.

### Steps to Configure:
1. Open the file [`backend/.env`](file:///C:/Users/admin/.gemini/antigravity/scratch/smartstudy-ai/backend/.env) in your editor.
2. Locate the line:
   ```env
   GEMINI_API_KEY=YOUR_API_KEY_HERE
   ```
3. Replace `YOUR_API_KEY_HERE` with your actual Google Cloud / Gemini API key (starts with `AIzaSy...`):
   ```env
   GEMINI_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
4. Save the file.
5. The Flask backend will immediately read the key from the environment. You can check the live status by clicking the **API Key / Engine Status** badge in the app header!

---

## ⚡ How to Run the Application

### 1. Start Backend (Python Flask)
```powershell
cd C:\Users\admin\.gemini\antigravity\scratch\smartstudy-ai\backend
python app.py
```
*The backend starts at `http://127.0.0.1:5000`.*

### 2. Start Frontend (React + Vite)
```powershell
cd C:\Users\admin\.gemini\antigravity\scratch\smartstudy-ai\frontend
npm run dev
```
*The frontend dashboard will be live at `http://localhost:5173`.*

*(You can also double-click `start_backend.bat` and `start_frontend.bat` from File Explorer.)*

---

## 🧠 Prompt Engineering Architecture

Every prompt in [`backend/prompts.py`](file:///C:/Users/admin/.gemini/antigravity/scratch/smartstudy-ai/backend/prompts.py) strictly enforces the 5-part prompt engineering architecture:

1. **AI Role**: Declares the pedagogical persona (e.g. *Academic Tutor*, *Exam Specialist*, *Feynman Educator*).
2. **Specific Task**: Defines the precise academic operation (e.g., summarize into key points, generate exactly 5 MCQs, elevate essay draft).
3. **Student Input**: Injects the student's raw study material or draft in delineated blocks.
4. **Output Format**: Strictly mandates valid, parseable JSON strictly adhering to schema keys (`shortSummary`, `importantPoints`, `keyDefinitions`, `examHighlights`, `questions`, etc.).
5. **Instructions & Restrictions**: Explicit rules forbidding external hallucinations, enforcing simple English, setting option counts, and avoiding unnecessary jargon.

---

## 🧪 Testing & Verification Guide

### 1. Health & Configuration Check
```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:5000/api/health" | ConvertTo-Json
```
- When key is missing: returns `geminiConfigured: false` and a clear setup reminder.
- When key is configured: returns `geminiConfigured: true` and `model: "gemini-2.5-flash"`.

### 2. Test Input Validation
- Submit empty text on any of the 4 tools.
- Expected Result: HTTP `400 Bad Request` with an immediate, friendly error alert (e.g. *"Study notes cannot be empty"*).

### 3. Test Feature Workflows
- **Notes Summarizer**: Click "Load Biology Sample Notes" -> Click "Generate Summary".
- **Quiz Generator**: Click "Load ML Notes Sample" -> Click "Generate 5-Question Quiz" -> Take the quiz by clicking options -> Verify scoring & explanations.
- **Answer Improver**: Click "Load Economics Essay Sample" -> Click "Improve & Elevate Answer" -> Inspect A+ answer and comparison view.
- **Concept Explainer**: Click "Load Blockchain Consensus Sample" -> Click "Explain Concept" -> Review analogy, steps, and revision summary.
