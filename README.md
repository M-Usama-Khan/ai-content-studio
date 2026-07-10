# 🚀 AI Content Studio

> **IBM Competition 2025 Project** — AI-Powered Content Creation Platform

AI Content Studio is a full-stack web application that helps content creators generate viral content ideas, write professional scripts, discover trending hashtags, and plan 30-day content calendars — all powered by **Groq AI (Llama 3.3 70B)**.

---

## ✨ Features

| Feature | Description |
|---|---|
| 💡 **Idea Generator** | Generate 10+ viral content ideas for any platform & niche using AI |
| ✍️ **Script Writer** | Auto-generate full video/post scripts with hooks, timestamps & CTAs |
| #️⃣ **Hashtag Tool** | Get trending, niche & general hashtags with posting time suggestions |
| 📅 **Content Calendar** | Create multiple 30-day content calendars with progress tracking |
| 📚 **History** | Search, filter & browse all your previously generated content |
| 📥 **PDF Export** | Download your ideas & scripts as professional PDF reports |
| ⚙️ **Profile** | Manage your account, preferred language & view usage stats |
| 🌐 **Multi-Language** | Supports English, Urdu & Hindi content generation |

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **FastAPI** | REST API framework (Python) |
| **PostgreSQL** | Relational database |
| **SQLAlchemy** | ORM for database operations |
| **Groq AI** | LLM API (Llama 3.3 70B Versatile) |
| **JWT (python-jose)** | Authentication & token management |
| **bcrypt** | Password hashing |
| **ReportLab** | PDF generation |

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI framework (TypeScript) |
| **React Router v6** | Client-side routing |
| **Tailwind CSS** | Utility-first styling |
| **Zustand** | Lightweight state management |
| **React Hot Toast** | Toast notifications |

---

## 📁 Project Structure

```
ai-content-studio/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app entry point
│   │   ├── database.py          # PostgreSQL connection & session
│   │   ├── models/
│   │   │   └── models.py        # SQLAlchemy models (User, Idea, Script, Calendar)
│   │   ├── schemas/
│   │   │   └── schemas.py       # Pydantic validation schemas
│   │   ├── routers/
│   │   │   ├── auth.py          # Register, Login, Get Current User
│   │   │   ├── ideas.py         # Idea generation & history
│   │   │   ├── scripts.py       # Script writing & hashtag generation
│   │   │   ├── calendar.py      # Multi-calendar CRUD & AI generation
│   │   │   ├── export.py        # PDF export for ideas & scripts
│   │   │   └── profile.py       # Profile management & stats
│   │   └── services/
│   │       ├── auth_service.py   # Password hashing, JWT, user lookup
│   │       └── groq_ai.py        # Groq AI integration (ideas, scripts, hashtags)
│   ├── .env                      # Environment variables
│   ├── requirements.txt          # Python dependencies
│   └── venv/                     # Virtual environment
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx               # Root component with routing
│   │   ├── api/                  # API service functions
│   │   │   ├── auth.ts           # Login & Register API
│   │   │   ├── ideas.ts          # Ideas API
│   │   │   ├── scripts.ts        # Scripts & Hashtags API
│   │   │   ├── calendar.ts       # Calendar API
│   │   │   └── dashboard.ts      # Dashboard stats API
│   │   ├── components/
│   │   │   └── Layout.tsx        # Sidebar layout with mobile support
│   │   ├── pages/
│   │   │   ├── Landing.tsx       # Public landing page
│   │   │   ├── Login.tsx         # Login page
│   │   │   ├── Register.tsx      # Registration page
│   │   │   ├── Dashboard.tsx     # Dashboard with stats & quick actions
│   │   │   ├── IdeaGenerator.tsx # AI idea generation page
│   │   │   ├── ScriptWriter.tsx  # AI script writing page
│   │   │   ├── HashtagTool.tsx   # Hashtag strategy generator
│   │   │   ├── Calendar.tsx      # Multi-calendar management
│   │   │   ├── History.tsx       # Content history with filters
│   │   │   └── Profile.tsx       # Profile & settings page
│   │   └── store/
│   │       └── authStore.ts      # Zustand auth state management
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

---

## ⚙️ Setup & Installation

### Prerequisites
- **Python 3.10+**
- **Node.js 18+**
- **PostgreSQL** (running locally or remote)
- **Groq API Key** — Get one free at [console.groq.com](https://console.groq.com)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/ai-content-studio.git
cd ai-content-studio
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Configure Environment Variables
Create a `.env` file inside the `backend/` folder:
```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/ai_content_db
SECRET_KEY=your-super-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
GROQ_API_KEY=your-groq-api-key
```

### 4. Create PostgreSQL Database
```sql
CREATE DATABASE ai_content_db;
```

### 5. Start Backend Server
```bash
cd backend
uvicorn app.main:app --reload
```
Backend will run at: **http://localhost:8000**

API docs available at: **http://localhost:8000/docs**

### 6. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```
Frontend will run at: **http://localhost:3000**

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Register new user |
| `POST` | `/auth/login` | Login (OAuth2 form) |
| `GET` | `/auth/me` | Get current user |

### Ideas
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/ideas/generate` | Generate AI content ideas |
| `GET` | `/ideas/history` | Get ideas history with filters |

### Scripts
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/scripts/generate` | Generate AI video script |
| `POST` | `/scripts/hashtags` | Generate hashtag strategy |
| `GET` | `/scripts/history` | Get scripts history |

### Calendar
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/calendar/generate` | Generate 30-day calendar |
| `GET` | `/calendar/list` | List all user calendars |
| `GET` | `/calendar/{id}` | Get specific calendar posts |
| `PATCH` | `/calendar/post/{id}` | Update post status |
| `DELETE` | `/calendar/{id}` | Delete a calendar |

### Export
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/export/ideas/pdf` | Download ideas as PDF |
| `GET` | `/export/scripts/pdf` | Download scripts as PDF |

### Profile
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/profile/` | Get profile & stats |
| `PATCH` | `/profile/update` | Update name & language |

---

## 🗄️ Database Schema

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────────┐
│      users       │     │      ideas       │     │       scripts        │
├──────────────────┤     ├──────────────────┤     ├──────────────────────┤
│ id (PK)          │◄────│ user_id (FK)     │     │ id (PK)              │
│ name             │     │ id (PK)          │     │ user_id (FK)     ────►│
│ email (unique)   │     │ platform         │     │ idea_title           │
│ password         │     │ niche            │     │ script_content       │
│ preferred_lang   │     │ language         │     │ caption              │
│ created_at       │     │ generated_ideas  │     │ hashtags             │
└──────────────────┘     │ created_at       │     │ platform             │
         │               └──────────────────┘     │ created_at           │
         │                                        └──────────────────────┘
         │
         │               ┌──────────────────────┐     ┌──────────────────────┐
         │               │  content_calendars   │     │   calendar_posts     │
         │               ├──────────────────────┤     ├──────────────────────┤
         └──────────────►│ id (PK)              │◄────│ calendar_id (FK)     │
                         │ user_id (FK)         │     │ id (PK)              │
                         │ name                 │     │ user_id (FK)         │
                         │ platform             │     │ post_date            │
                         │ niche                │     │ topic                │
                         │ language             │     │ platform             │
                         │ created_at           │     │ status               │
                         └──────────────────────┘     │ created_at           │
                                                      └──────────────────────┘
```

---

## 🔐 Authentication Flow

1. User registers with name, email, password & preferred language
2. Password is hashed using **bcrypt** before storing
3. On login, a **JWT token** is generated and returned
4. Frontend stores the token in `localStorage`
5. All protected API calls include `Authorization: Bearer <token>` header
6. Token is validated on every request using **OAuth2PasswordBearer**

---

## 🤖 AI Integration

This project uses **Groq Cloud API** with the **Llama 3.3 70B Versatile** model for:

- **Content Ideas** — Generates viral content ideas with titles, descriptions, hooks & viral scores
- **Script Writing** — Creates full scripts with timestamps, hooks, CTAs & captions
- **Hashtag Strategy** — Provides trending/niche/general hashtags with best posting times
- **Calendar Planning** — Generates 30 unique content topics for a 30-day schedule

All AI responses are parsed as structured JSON for consistent frontend rendering.

---

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first grid layouts
- Collapsible sidebar navigation
- Touch-friendly UI elements
- Adaptive card layouts (1-2-3 column grids)

---

## 👨‍💻 Developer

**Built for IBM Competition 2025**

---

## 📄 License

This project is built for educational and competition purposes.