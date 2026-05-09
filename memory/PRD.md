# Chronos – Job Scheduler PRD

## Original Problem Statement
Fix and make backend code connect and work with the frontend. Browser console showed:
`POST http://localhost:8000/api/v1/users/login net::ERR_CONNECTION_REFUSED`

## Architecture
- **Backend:** Node.js + TypeScript, Express 5, Mongoose 9 (`/app/Backend`)
- **Frontend:** React 19 + Vite + TypeScript (`/app/frontend`)
- **DB:** MongoDB (local, supervisor-managed)

## Tasks Completed (2026-05-09)
- Created `/app/Backend/.env` with `MONGODB_URI`, `PORT=8001`, JWT secrets, `CORS_ORIGIN=*`.
- Created `/app/frontend/.env` with `VITE_API_URL` pointing to the production preview URL `/api/v1`.
- Created `/app/frontend/vite.config.ts` (host `0.0.0.0`, port `3000`, HMR over `wss`/443, polling watcher, `allowedHosts: true`).
- Added `start` script (alias of `vite`) to `/app/frontend/package.json` so supervisor's `yarn start` works.
- Updated `/app/frontend/src/services/api.ts` to read `VITE_API_URL` (no more `localhost:8000` hardcode).
- Updated `/app/frontend/src/contexts/AuthContext.tsx` to unwrap the backend's `apiResponse` envelope (`response.data.data.accessToken`) and auto-login after register.
- Replaced `ts-node-dev --esm` with `tsx watch` in backend `dev` script (incompatible flag with Node 20).
- Installed backend deps via `npm install` (added `tsx`).
- Fixed Mongoose 9 incompatibility in `user.model.ts` pre-save hook (async hooks no longer receive `next`).
- Removed double-hashing of password in `user.controller.ts` (model's pre-save already hashes).
- Updated `/etc/supervisor/conf.d/supervisord.conf` so `backend` runs `npm run dev` from `/app/Backend` on port `8001` (kubernetes ingress routes `/api/*` → `:8001`).

## Verified End-to-End
- `POST /api/v1/users/register` → 201 Created.
- `POST /api/v1/users/login` → 200 with `accessToken`.
- Browser login flow: form submit → redirect to `/jobs` → JWT stored in `localStorage`.

## Backlog / Next Items
- P1: Verify and polish `/jobs`, `/notifications`, `/job-logs` pages (blank screens may exist).
- P1: Add a real `JWT_SECRET` rotation strategy for production.
- P2: Replace `CORS_ORIGIN=*` with the exact preview/production URL.
- P2: Surface backend error messages in frontend toasts.
