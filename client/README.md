# EduPlatform — Client

EduPlatform is a modern, comprehensive Learning Management System (LMS) frontend built with **React 18** and **Vite**. It offers a rich, interactive educational experience for both students and instructors, featuring an AI-powered Career Assessment and an integrated chatbot.

## Key Features

### Role-Based Access Control
- **Students**: Access to course enrollments, personalized dashboards, a dedicated course player, and settings.
- **Instructors**: Dedicated instructor dashboard with capabilities to add, update, and manage course content.

### AI-Powered Career Assessment
A sophisticated 3-stage career discovery tool powered by Google's Gemini AI:
1. **Interest Discovery** — Identifies natural interests and preferences across multiple domains.
2. **Knowledge Assessment** — Evaluates technical readiness and baseline knowledge.
3. **Personalized Evaluation** — Dynamically generates targeted questions to recommend personalized career paths, certifications, and job opportunities.

### Interactive Chatbot
A floating AI chatbot integrated directly into the platform to assist users with navigation, queries, and contextual help.

### Course Management and Player
- Seamless browsing and enrollment in courses.
- Dedicated `CoursePlayer` component for an immersive learning experience.
- Instructor tools (`AddCourse`, `UpdateCourse`, `AdminCourses`) to manage the curriculum.

## Technology Stack

- **Core Framework**: [React 18](https://reactjs.org/) & [Vite](https://vitejs.dev/)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **State Management**:
  - [Redux Toolkit](https://redux-toolkit.js.org/) — global auth state
  - [TanStack React Query](https://tanstack.com/query/latest) — async state and data fetching
- **Styling and UI**:
  - [Tailwind CSS](https://tailwindcss.com/)
  - [Headless UI](https://headlessui.com/)
  - [Heroicons](https://heroicons.com/) & [React Icons](https://react-icons.github.io/react-icons/)
- **Forms and Validation**: [Formik](https://formik.org/) & [Yup](https://github.com/jquense/yup)
- **API Client**: [Axios](https://axios-http.com/)

## Project Structure

```text
client/
├── public/             # Static public assets
└── src/
    ├── assets/         # Images and icons
    ├── components/     # React components organized by feature
    │   ├── Admin/      # Course management for instructors
    │   ├── AuthRoute/  # Route protection and role-based wrappers
    │   ├── Chatbot/    # Floating chatbot components
    │   ├── Courses/    # Course browsing and player
    │   ├── Dashboard/  # User and instructor dashboards
    │   ├── Home/       # Landing page and Assessment features
    │   ├── Navbar/     # Public, Private, and Instructor navigation
    │   └── User/       # Login, Register, and Settings
    ├── reactQuery/     # API hooks and query/mutation configurations
    ├── redux/          # Redux slices and store setup
    ├── services/       # API integrations (courseService, chatbotService, aiAssessmentService)
    ├── utils/          # Helper functions and utilities
    ├── App.jsx         # Main application component and routing
    └── main.jsx        # Entry point
```

## Setup and Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### 1. Clone and Install Dependencies
```bash
git clone https://github.com/your-username/EduPlatform.git
cd EduPlatform/client
npm install
```

### 2. Environment Configuration
Create a `.env` file in the `client/` root:
```env
# Backend API URL
VITE_API_URL=http://localhost:5000

# Gemini API Key for the AI Assessment Feature
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

> Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey).

### 3. Run the Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

### 4. Build for Production
```bash
npm run build
```
Generates the optimized production build in the `dist/` folder. Preview it locally with:
```bash
npm run preview
```

## Scripts Overview

| Script | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Compile and bundle for production |
| `npm run lint` | Run ESLint for code quality checks |
| `npm run preview` | Preview the production build locally |
| `npm run format` | Format code with Prettier |
| `npm test` | Run test suites via Jest |

## License

This project is licensed under the ISC License.
