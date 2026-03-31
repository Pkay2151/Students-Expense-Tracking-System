# Backend (Student Expense Tracking System)

## Overview
This backend provides REST APIs for wallets, transactions, transfers, budgets, and summary data.

## Tech Stack
- Node.js
- Express
- MongoDB + Mongoose

## Quick Start
1. Install dependencies:
   - `npm install`
2. Start in development mode:
   - `npm run dev`
3. Backend runs on:
   - `http://localhost:5000`

## Environment Variables
Copy `.env.example` values into your environment:
- `PORT` (default: `5000`)
- `FRONTEND_ORIGIN` (default: `http://localhost:5173`)
- `MONGODB_URI` (default: `mongodb://127.0.0.1:27017/students-expense-tracker`)

## Authentication Approach (Current)
Protected routes require header:
- `x-user-id: <some-user-id>` or `x-user-uid: <firebase-uid>`

Optional identity headers:
- `x-user-email: <user-email>`
- `x-user-name: <display-name>`

This keeps data separated per user in MongoDB.

## API Routes
- `GET /api/health`
- `GET /api/wallets`
- `POST /api/wallets`
- `GET /api/transactions`
- `POST /api/transactions`
- `POST /api/transactions/transfer`
- `GET /api/budgets`
- `POST /api/budgets`
- `GET /api/summary`
- `GET /api/profile`
- `PUT /api/profile`

## Example Request
Create wallet:

```http
POST /api/wallets
x-user-id: test-user
Content-Type: application/json

{
  "name": "Mobile Money",
  "type": "mobile",
  "balance": 200
}
```
