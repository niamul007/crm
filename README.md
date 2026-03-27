# Client Tracker

A full stack CRM built for freelancers and agency owners to manage clients, track project budgets, log payments, and keep notes — all in one place.

**Live Demo → [client-tracker-crm.vercel.app](https://client-tracker-crm.vercel.app)**

---

## The Problem

Freelancers and agency managers often juggle client information across spreadsheets, notes apps, and memory. There's no single place to see who owes what, which projects are active, and what was discussed with a client last week.

Client Tracker solves this by giving you a clean, private dashboard to manage everything in one place.

---

## Features

- **Authentication** — Secure register and login with JWT. Each user only sees their own clients.
- **Client Management** — Add, edit, and delete clients with full project details including status, deadline, and budget.
- **Payment Tracking** — Log payments against a client's budget and see how much has been received and how much remains at a glance.
- **Notes** — Attach timestamped notes to any client for quick context on calls, meetings, or decisions.
- **Dashboard Overview** — See total clients, active projects, and total budget across all clients on one screen.
- **Protected Routes** — All pages are protected. Unauthenticated users are redirected to login automatically.

---

## Tech Stack

### Frontend
- React 19 + Vite
- Tailwind CSS
- React Router v7
- Axios with request interceptors for automatic JWT attachment
- Context API for global auth state

### Backend
- Node.js + Express.js (ES Modules)
- PostgreSQL via Neon.tech
- JWT authentication
- Zod schema validation
- Custom error handling — `AppError`, `catchAsync`, `globalErrorHandler`

### Deployment
- Frontend — Vercel
- Backend — Render
- Database — Neon.tech (PostgreSQL)

---

## Architecture Highlights

**JWT Auth Flow**
User logs in → backend signs a JWT → token stored in localStorage → Axios interceptor attaches it to every request → backend middleware verifies it on protected routes.

**JOIN Query + Frontend Transformation**
The client detail endpoint uses a `LEFT JOIN` across three tables (clients, payments, notes). The raw rows are returned flat and transformed on the frontend into a nested object with `payments[]` and `notes[]` arrays — avoiding over-engineering on the backend.

**Reusable Form Component**
`ClientForm.jsx` handles both creating and editing a client. Edit mode is detected via `useLocation` state passed during navigation — no duplicate components.

---

## API Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

GET    /api/clients
POST   /api/clients
GET    /api/clients/:id
PUT    /api/clients/:id
DELETE /api/clients/:id

POST   /api/clients/:id/payments
DELETE /api/clients/:id/payments/:pid

POST   /api/clients/:id/notes
DELETE /api/clients/:id/notes/:nid
```

---

## Project Structure

```
crm/
├── server/
│   └── src/
│       ├── app.mjs
│       ├── controllers/
│       ├── services/
│       ├── routes/
│       ├── middleware/
│       ├── validation/
│       ├── utils/
│       └── db/
└── front-end/
    └── client/
        └── src/
            ├── api/
            ├── context/
            ├── components/
            └── pages/
```

---

## Running Locally

### Backend
```bash
cd server
npm install
# create .env with DATABASE_URL, JWT_SECRET, PORT, FRONTEND_URL
npm run dev
```

### Frontend
```bash
cd front-end/client
npm install
# create .env with VITE_API_BASE_URL=http://localhost:8000
npm run dev
```

---

## Author

**Niamul** — Self-taught full stack developer  
[GitHub](https://github.com/niamul007) · [X](https://x.com/NiamulNotizj) · [Webmox](https://webmox.net)
