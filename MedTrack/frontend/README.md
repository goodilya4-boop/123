# MedTrack Frontend

React + Vite frontend for the MedTrack API Gateway.

## Run

From this directory:

```bash
npm install
npm run dev
```

Frontend: http://localhost:3000

The Vite development server proxies `/api/*` to:

```
http://localhost:8080
```

So the API Gateway should be running on port 8080.

## Backend routes used

- POST /api/auth/signup
- POST /api/auth/signin
- GET /api/users/:id
- PUT /api/users/:id
- GET /api/users

The frontend stores the short-lived access token in localStorage because the current backend exposes no refresh-token endpoint. The API Gateway still receives it as `Authorization: Bearer <token>`.

## Production

Set `VITE_API_URL` to the public API Gateway URL if the frontend is hosted on a different origin, then run:

```bash
npm run build
```

Vite outputs the production bundle to `dist/`.
