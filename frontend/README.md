# Student Expense Tracking System Frontend

## Project Overview
This is the React frontend for the Student Expense Tracking System. It provides the login, signup, dashboard, wallets, budget, analytics, and profile screens for managing student finances.

The frontend uses:
- React
- Vite
- React Router
- Firebase Authentication
- A REST API backend for wallets, transactions, budgets, transfers, and profile data

## Setup
1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open the local Vite URL shown in the terminal.

## Environment Variables
The frontend can be configured with the following variable:

- `VITE_API_BASE_URL` - Backend API base URL. Defaults to `http://localhost:5000/api` if not provided.

Example:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Authentication
Firebase Authentication handles user signup, login, logout, and session state.

The Firebase configuration is defined in `src/firebase.js`.

## App Routes
Public routes:
- `/`
- `/login`
- `/signup`

Protected dashboard routes:
- `/dashboard`
- `/dashboard/wallets`
- `/dashboard/analytics`
- `/dashboard/budget`
- `/dashboard/profile`

## API Integration
The frontend sends authenticated requests to the backend through `src/utils/api.js`.

Requests include Firebase user identity headers such as:
- `x-user-uid`
- `x-user-email`
- `x-user-name`

## Build
Create a production build with:

```bash
npm run build
```

Preview the production build with:

```bash
npm run preview
```

## Lessons Learned
- Clear separation between frontend UI and backend persistence makes the app easier to maintain.
- Environment-based API configuration is better than hardcoding service URLs in components.
- Protected routes help keep authenticated views isolated from public pages.
- Using async API calls with loading states improves the user experience for form submissions.
