# EduPlatform — Server

> Personalized Pathways in Tech Learning — Backend REST API

This directory contains the backend service for **EduPlatform**, built with Node.js and Express.js. It provides robust APIs for user management, course content delivery, progress tracking, and AI-driven chatbot interactions.

## Features

- **Authentication & Authorization**: Secure user registration, login, and role-based access control using JWT and bcrypt.
- **Course Management**: APIs for retrieving courses, detailed sections, and structured learning paths.
- **Progress Tracking**: Track user progress across different courses and modules.
- **AI Integration**: Built-in chatbot router utilizing `@google/generative-ai` (Gemini).
- **Security**: Hardened with `helmet`, `cors`, and `express-rate-limit` to protect against common web vulnerabilities and abuse.
- **File Uploads**: Supports multipart/form-data for file uploads using `multer`.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JSON Web Tokens (JWT), bcryptjs
- **Security**: Helmet, Express Rate Limit, CORS
- **AI Tools**: Google Generative AI (Gemini)

## Project Structure

```
server/
├── controllers/          # Request handlers for various routes
├── middlewares/          # Custom Express middlewares (auth, error handling)
├── models/               # Mongoose schemas (User, Course, CourseSection)
├── routes/               # API route definitions (users, courses, chatbot, etc.)
├── services/             # Core business logic and external service integrations
├── utils/                # Helper functions and database connection logic
├── server.js             # Application entry point
├── .env.example          # Environment variable template
└── package.json          # Project metadata and dependencies
```

## Prerequisites

Before you begin, ensure you have met the following requirements:
- **Node.js** (v16.x or higher)
- **npm** (v7.x or higher)
- **MongoDB** (Local instance or MongoDB Atlas URI)

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/EduPlatform.git
   cd EduPlatform/server
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database
MONGO_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key

# AI Integration (optional)
# GEMINI_API_KEY=your_google_gemini_api_key
```

## Running the Application

**Development Mode** (auto-restarts on file changes via Nodemon):
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

## API Endpoints Overview

The API is mounted at `/api/v1/`.

| Route | Description |
|---|---|
| `POST /api/v1/users/register` | Register a new user |
| `POST /api/v1/users/login` | Log in and receive a JWT |
| `GET /api/v1/courses` | Fetch all courses |
| `GET /api/v1/course-sections` | Fetch course sections |
| `GET /api/v1/progress` | Get user progress |
| `POST /api/v1/chatbot` | Send a message to the AI chatbot |

## Error Handling

The application uses a centralized error-handling middleware (`middlewares/errorMiddleware.js`) to ensure consistent API responses. All unhandled routes return a standardized `404 Route not found` response.

## License

This project is licensed under the ISC License.
