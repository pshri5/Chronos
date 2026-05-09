# Chronos - Job Management System

Chronos is a full-stack job management platform designed to schedule, execute, and monitor background tasks. It provides a comprehensive system for managing one-time and recurring jobs with integrated logging and user notifications.

## 🚀 Project Overview

### Backend
The backend is a Node.js/Express server built with TypeScript and MongoDB.
- **Core Features**:
  - **Job Scheduling**: Support for one-time and recurring (cron-based) jobs.
  - **Execution Engine**: A dedicated queue service to handle job execution and retries.
  - **Auth System**: JWT-based authentication and password hashing with bcrypt.
  - **Notification System**: Real-time notifications for job lifecycle events.
  - **Monitoring**: Detailed execution logs for every job run.
  - **Health Check**: Integrated health monitoring endpoint.

### Frontend
A modern React-based dashboard built with Vite, TypeScript, and Tailwind CSS.
- **Features**:
  - **Job Dashboard**: List, filter, and manage all scheduled jobs.
  - **Job Lifecycle Management**: Create, edit, execute, and cancel jobs through a sleek UI.
  - **Log Viewer**: Detailed execution logs for auditing and debugging.
  - **Notification Center**: Track and manage system alerts.
  - **Authentication**: Secure login and registration flow.

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, Vite, TypeScript, Tailwind CSS, Axios, React Router 7 |
| **Backend** | Node.js, Express 5, TypeScript, Mongoose |
| **Database** | MongoDB |
| **Authentication** | JSON Web Tokens (JWT), bcrypt |
| **Testing** | Vitest, Supertest (Integration & Unit tests) |
| **Package Manager** | pnpm |

## 🚦 Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- MongoDB (Local instance or Atlas)
- pnpm (`npm install -g pnpm`)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Chronos
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   pnpm install
   cp .env.sample .env # Update MONGODB_URI, ACCESS_TOKEN_SECRET, etc.
   pnpm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   pnpm install
   pnpm run dev
   ```

## 🧪 Testing

The backend includes a comprehensive test suite using **Vitest**.

```bash
cd Backend
pnpm run test          # Run all tests
pnpm run test:coverage # Run tests with coverage report
```

## 📁 Project Structure

```text
Chronos/
├── Backend/
│   ├── src/
│   │   ├── controllers/   # Route handlers
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # API route definitions
│   │   ├── services/      # Business logic & Job queue engine
│   │   ├── middlewares/   # Auth & Error handling
│   │   └── utils/         # API response & Async helpers
│   └── tests/             # Unit and Integration tests
└── frontend/
    ├── src/
    │   ├── components/    # Reusable UI components
    │   ├── pages/         # Page views (Dashboard, Login, etc.)
    │   ├── services/       # API integration layer
    │   ├── contexts/      # Global state (AuthContext)
    │   └── routes/        # App navigation logic
    └── vitest.config.ts    # Frontend test configuration
```

## 📜 API Endpoints

| Endpoint | Method | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `/health` | GET | Check server heartbeat | No |
| `/api/v1/users/register` | POST | Create new account | No |
| `/api/v1/users/login` | POST | Authenticate user | No |
| `/api/v1/jobs` | GET | Fetch user's jobs | Yes |
| `/api/v1/jobs` | POST | Create a new job | Yes |
| `/api/v1/jobs/:id` | GET | Get job details | Yes |
| `/api/v1/jobs/:id` | PATCH | Update job settings | Yes |
| `/api/v1/jobs/:id` | DELETE | Remove a job | Yes |
| `/api/v1/jobs/:id/execute`| POST | Manually trigger job | Yes |
| `/api/v1/jobs/:id/cancel` | POST | Cancel a pending job | Yes |
| `/api/v1/notifications` | GET | Get user notifications | Yes |
| `/api/v1/job-logs` | GET | Get all recent logs | Yes |
