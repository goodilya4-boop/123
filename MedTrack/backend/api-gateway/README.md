# API Gateway

Единая точка входа для backend-сервисов MedTrack.

## Routes

- `POST /api/auth/signup` -> auth-service
- `POST /api/auth/signin` -> auth-service
- `/api/users/*` -> auth-service, JWT required
- `/api/audit/*` -> audit-service, JWT required
- `GET /health` -> gateway

The gateway accepts `Authorization: Bearer <token>` and the legacy `x-access-token` header. The same JWT secret, issuer and audience must be configured in the gateway and auth-service.

## Run

1. Copy `.env.example` to `.env`.
2. Set the service URLs and the same JWT settings used by auth-service.
3. Install dependencies with `npm install`.
4. Start with `npm start`.

Default port: `8080`.
