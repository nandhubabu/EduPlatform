# EduPlatform

Personalized Pathways in Tech Learning — A Full-Stack MERN Learning Management System.

EduPlatform is an educational platform designed to provide a modern, interactive learning experience for students and instructors. Built with a decoupled React and Node.js architecture, it includes role-based access control, an interactive course player, an AI-assisted career assessment tool, student progress tracking, and instructor course management.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture and Directory Structure](#architecture-and-directory-structure)
- [Core Features](#core-features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
- [Environment Variables](#environment-variables)
- [API Endpoints Reference](#api-endpoints-reference)
- [Production Deployment](#production-deployment)
- [Security and Best Practices](#security-and-best-practices)
- [License](#license)

---

## Project Overview

EduPlatform bridges the gap between course discovery, structured learning, and career orientation:
- **Learners** can explore curated courses, enroll, track module-by-module completion, test their knowledge with an AI-driven career advisor, and view completion leaderboards.
- **Instructors** have access to a dedicated studio dashboard to author courses, structure syllabus modules, monitor enrollment numbers, and manage published content.

---

## Architecture and Directory Structure

The repository is structured as a monorepo containing decoupled client and server applications:

```
EduPlatform/
├── client/                      # React 18 frontend built with Vite
│   ├── public/                  # Static public assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── Admin/           # Instructor course and section management
│   │   │   ├── Alert/           # Notification and alert feedback components
│   │   │   ├── AuthRoute/       # Role-based route guard wrappers
│   │   │   ├── Chatbot/         # AI assistant floating component
│   │   │   ├── Courses/         # Catalog, details, and classroom video player
│   │   │   ├── Dashboard/       # Student and Instructor dashboard dispatchers
│   │   │   ├── Home/            # Landing page and Career Assessment modules
│   │   │   ├── Navbar/          # Responsive public and authenticated navigation
│   │   │   ├── NotFound/        # 404 error page component
│   │   │   ├── Students/        # Student rankings and progress components
│   │   │   └── User/            # Authentication, settings, and profile views
│   │   ├── reactQuery/          # TanStack Query API service layer
│   │   ├── redux/               # Redux Toolkit slices (authentication state)
│   │   ├── services/            # Client-side utility and AI assessment services
│   │   ├── utils/               # Base URL configuration and helper routines
│   │   ├── App.jsx              # Application router and layout root
│   │   └── main.jsx             # React entrypoint and global providers
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vercel.json              # Vercel SPA rewrite configuration
│   └── vite.config.js
│
├── server/                      # Node.js and Express REST API backend
│   ├── controllers/             # Business logic controllers
│   ├── middlewares/             # Auth checks, error handling, rate limiting
│   ├── models/                  # Mongoose data schemas (User, Course, Section, Progress)
│   ├── routes/                  # Express route definitions
│   ├── utils/                   # Database connection and helper utilities
│   ├── package.json
│   └── server.js                # API server entrypoint and middleware pipeline
│
├── render.yaml                  # Infrastructure-as-code blueprint for Render
├── DEPLOYMENT_GUIDE.md          # Step-by-step production deployment instructions
└── README.md                    # Project documentation
```

---

## Core Features

### 1. Catalog Discovery and Course Exploration
- Search courses dynamically by title, category, instructor, or difficulty.
- Multi-facet filters for pricing, skill level, and user ratings.
- Course landing pages featuring detailed syllabus overviews, learning outcomes, and instructor details.

### 2. Classroom Video Player
- Video-based course player with progress tracking.
- Interactive curriculum drawer with completed lesson indicators.
- Synchronized lesson modules and resource notes tabs.

### 3. Role-Based Dashboards
- **Student Dashboard**: Real-time view of active enrollments, course completion percentages, and resume-learning links.
- **Instructor Studio**: Analytics on total courses created, enrolled student counts, estimated earnings, and quick course-authoring tools.

### 4. AI Career Assessment Engine
- Multi-step assessment analyzing student interests, technical background, and career goals.
- Algorithmic skill matching recommending specialized roles, industry certifications, and learning pathways.

### 5. Secure Authentication and Profile Control
- JWT-based authentication stored in HTTP-only cookies.
- Password hashing using bcryptjs.
- Forgot-password and token-based password reset workflows.
- Account settings to update email, username, and profile credentials.

---

## Technology Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Server Cache and Mutations**: TanStack Query (React Query v5)
- **Routing**: React Router v6
- **Forms and Validation**: Formik, Yup
- **Icons**: React Icons (FontAwesome, Feather, Remix Icons)

### Backend
- **Runtime**: Node.js
- **Web Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Token (jsonwebtoken), bcryptjs, cookie-parser
- **Security**: Helmet, Express Rate Limit, CORS with dynamic origin filtering
- **Logging**: Morgan

---

## Prerequisites

Before running the project locally, ensure you have the following installed:
- Node.js (version 18.x or later recommended)
- npm (version 9.x or later)
- Git
- A MongoDB database (either a local instance or a free MongoDB Atlas cluster)

---

## Local Development Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/EduPlatform.git
cd EduPlatform
```

### 2. Configure and Run Backend
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the server:
```bash
npm run dev
```
The backend API will be available at `http://localhost:5000`.

### 3. Configure and Run Frontend
Open a new terminal window:
```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000
```

Start the Vite development server:
```bash
npm run dev
```
The application will be accessible at `http://localhost:5173`.

---

## Environment Variables

### Backend (`server/.env`)

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port number the backend server listens on | `5000` |
| `NODE_ENV` | Application environment (`development` or `production`) | `development` |
| `MONGO_URI` | MongoDB connection URI | `mongodb+srv://user:pass@cluster.mongodb.net/eduplatform` |
| `JWT_SECRET` | Secret key for signing JSON Web Tokens | `your_secret_key` |
| `FRONTEND_URL` | Allowed client origin for CORS requests | `http://localhost:5173` |

### Frontend (`client/.env`)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Base URL of the backend API | `http://localhost:5000` |

---

## API Endpoints Reference

### Health and Monitoring
- `GET /health` - Server status check

### Authentication and User Management (`/api/v1/users`)
- `POST /api/v1/users/register` - Create a new user account
- `POST /api/v1/users/login` - Authenticate user and issue JWT cookie
- `POST /api/v1/users/logout` - Clear authentication session cookie
- `GET /api/v1/users/check-auth` - Validate current authentication status
- `POST /api/v1/users/forgot-password` - Request password reset email
- `POST /api/v1/users/reset-password/:resetToken` - Reset password with token
- `PUT /api/v1/users/update-email` - Update user email
- `PUT /api/v1/users/update-password` - Change account password

### Courses (`/api/v1/courses`)
- `GET /api/v1/courses` - Retrieve all published courses
- `POST /api/v1/courses` - Create a new course (Instructor only)
- `GET /api/v1/courses/:id` - Fetch single course details and sections
- `PUT /api/v1/courses/:id` - Update existing course (Instructor only)
- `DELETE /api/v1/courses/:id` - Remove course (Instructor only)

### Course Sections (`/api/v1/course-sections`)
- `GET /api/v1/course-sections` - List all course sections
- `POST /api/v1/course-sections/:courseId` - Add a section to a course
- `GET /api/v1/course-sections/:id` - Retrieve section details
- `PUT /api/v1/course-sections/:id` - Update section details
- `DELETE /api/v1/course-sections/:id` - Remove a section

### Student Progress (`/api/v1/progress`)
- `POST /api/v1/progress/apply` - Enroll in a course
- `POST /api/v1/progress/start-section` - Start a course module
- `PUT /api/v1/progress/update` - Update progress completion state
- `GET /api/v1/progress/ranking/:courseId` - Course leaderboard

---

## Production Deployment

This project is pre-configured for deployment on **Vercel** (frontend) and **Render** (backend):

1. **Backend on Render**:
   - Create a Web Service connected to your repository.
   - Set the Root Directory to `server`.
   - Build Command: `npm install`.
   - Start Command: `node server.js`.
   - Supply `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`, and `FRONTEND_URL`.
   - Alternatively, deploy using the included `render.yaml` blueprint.

2. **Frontend on Vercel**:
   - Import the repository in Vercel.
   - Set the Root Directory to `client`.
   - Framework Preset: `Vite`.
   - Add environment variable `VITE_API_URL` pointing to your live Render backend URL.
   - The included `client/vercel.json` provides single-page application rewrites to prevent 404 errors on page refresh.

Refer to `DEPLOYMENT_GUIDE.md` for full step-by-step instructions.

---

## Security and Best Practices

- **Cookie Security**: Authentication cookies use `httpOnly: true`, and in production environments enable `secure: true` and `sameSite: "none"` to allow safe cross-origin transmission.
- **Rate Limiting**: Integrated `express-rate-limit` prevents brute-force attempts.
- **HTTP Headers**: `helmet` is enabled to enforce secure HTTP headers.
- **Sanitized Inputs**: Form inputs are validated using `express-validator` on the server and `Yup` on the client.

---

## License

This project is licensed under the ISC License.
