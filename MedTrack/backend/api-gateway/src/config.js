require("dotenv").config();

function required(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

const jwtSecret = required("JWT_SECRET");

if (jwtSecret.length < 32) {
    throw new Error("JWT_SECRET must contain at least 32 characters.");
}

module.exports = {
    port: Number(process.env.PORT || 8080),
    authServiceUrl: required("AUTH_SERVICE_URL").replace(/\/$/, ""),
    auditServiceUrl: required("AUDIT_SERVICE_URL").replace(/\/$/, ""),
    jwt: {
        secret: jwtSecret,
        issuer: process.env.JWT_ISSUER || "medtrack-auth",
        audience: process.env.JWT_AUDIENCE || "medtrack"
    },
    corsOrigins: (process.env.CORS_ORIGINS || "http://localhost:3000")
        .split(",")
        .map(value => value.trim())
        .filter(Boolean),
    rateLimit: {
        windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
        max: Number(process.env.RATE_LIMIT_MAX || 300)
    }
};
