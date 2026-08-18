# EduPlatform

> Personalized Pathways in Tech Learning — A full-stack MERN Learning Management System

EduPlatform is a comprehensive LMS that delivers an interactive educational experience for students and instructors. It features role-based dashboards, a dedicated course player, an AI-powered Career Assessment, and an integrated chatbot.

---

## Repository Structure

```
EduPlatform/
├── client/    # React + Vite frontend
└── server/    # Node.js + Express backend API
```

- **[`client/`](./client/README.md)** — React 18, Vite, Tailwind CSS, Redux Toolkit, TanStack Query
- **[`server/`](./server/README.md)** — Node.js, Express, MongoDB (Mongoose), JWT, Google Gemini AI

---

## Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/your-username/EduPlatform.git
cd EduPlatform
```

### 2. Start the Server (Backend)
```bash
cd server
cp .env.example .env   # Fill in your values
npm install
npm run dev            # Runs on http://localhost:5000
```

### 3. Start the Client (Frontend)
```bash
cd client
cp .env.example .env   # Fill in your values (if applicable)
npm install
npm run dev            # Runs on http://localhost:5173
```

---

## Features at a Glance

| Feature | Description |
|---|---|
| 🔐 Auth | JWT-based login/register with role-based access (student / instructor) |
| 📚 Courses | Browse, enroll, and play courses with a dedicated course player |
| 📊 Dashboard | Separate dashboards for students and instructors |
| 🤖 AI Chatbot | Floating chatbot powered by Google Gemini AI |
| 🎯 Career Assessment | 3-stage AI-driven career path recommendation tool |
| 📈 Progress Tracking | Track learning progress across modules and courses |

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Redux Toolkit, TanStack Query, Axios |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs |
| **AI** | Google Generative AI (Gemini) |
| **Deployment** | Vercel (client), Render / Railway (server) |

---

## Environment Variables

See [`server/.env.example`](./server/.env.example) for the required backend variables.

Key variables:
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — Secret key for signing JWTs
- `VITE_API_URL` — Backend URL (used in the client)
- `VITE_GEMINI_API_KEY` — Google Gemini API key (used in the client for AI features)

---

## License

This project is licensed under the **ISC License**.
