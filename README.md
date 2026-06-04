# OpenEd

An educational content sharing platform where users create and share notes, study guides, ask questions, and upload PDFs.

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS v4 + Shadcn UI
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL
- **Storage**: Supabase Storage
- **Auth**: JWT + Google OAuth

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- A Supabase project (for file storage)
- Google OAuth credentials (for social login)

## Setup

### 1. Database

Create a PostgreSQL database and run the migration:

```bash
psql -U your_user -d opened -f backend/database/migrations/001_initial.sql
```

### 2. Environment Variables

Copy the example env file and configure your values:

```bash
cp backend/.env.example backend/.env
```

Required variables:
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — Secret key for signing JWTs
- `GOOGLE_CLIENT_ID` — Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` — Google OAuth client secret
- `SUPABASE_URL` — Your Supabase project URL
- `SUPABASE_SERVICE_KEY` — Supabase service role key

### 3. Install Dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

### 4. Run Development Servers

```bash
# Terminal 1 — Backend (runs on http://localhost:3001)
cd backend && npm run dev

# Terminal 2 — Frontend (runs on http://localhost:5173)
cd frontend && npm run dev
```

## Project Structure

```
opened/
├── shared/          # Shared TypeScript types and constants
├── backend/         # Express REST API server
│   └── src/
│       ├── config/      # Environment, database, storage config
│       ├── middleware/   # Auth, error handling, validation
│       ├── modules/     # Feature modules (auth, notes, etc.)
│       └── utils/       # Shared utilities
├── frontend/        # React single-page application
│   └── src/
│       ├── components/  # UI, layout, and shared components
│       ├── features/    # Feature-specific components
│       ├── pages/       # Route-level page components
│       ├── services/    # API client functions
│       └── hooks/       # Custom React hooks
└── README.md
```

## API Overview

| Resource | Endpoints |
|----------|-----------|
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` |
| Notes | `GET/POST /api/notes`, `GET/PUT/DELETE /api/notes/:id` |
| Guides | `GET/POST /api/guides`, `GET/PUT/DELETE /api/guides/:id` |
| Questions | `GET/POST /api/questions`, `GET /api/questions/:id` |
| Answers | `POST /api/questions/:id/answers`, `POST /api/answers/:id/accept` |
| PDFs | `POST /api/pdf/upload`, `GET /api/pdf/:id` |
| Search | `GET /api/search` |

All responses follow: `{ success: boolean, data?: T, error?: string, meta?: {...} }`
