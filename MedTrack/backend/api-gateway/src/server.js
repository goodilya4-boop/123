require("dotenv").config();

const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const config = require("./config");
const { verifyToken } = require("./middleware/auth");
const { createServiceProxy } = require("./proxy");

const app = express();

app.disable("x-powered-by");

app.use(cors({
    origin: config.corsOrigins,
    credentials: true
}));

app.use(rateLimit({
    windowMs: config.rateLimit.windowMs,
    limit: config.rateLimit.max,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    skip: req => req.path === "/health"
}));

app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        service: "api-gateway"
    });
});

// Authentication endpoints are public; auth-service performs its own validation.
app.use("/api/auth", createServiceProxy(config.authServiceUrl));

// User and audit endpoints require a valid JWT at the gateway.
// The downstream services validate it again for defense in depth.
app.use("/api/users", verifyToken, createServiceProxy(config.authServiceUrl));
app.use("/api/audit", verifyToken, createServiceProxy(config.auditServiceUrl));

app.use((req, res) => {
    res.status(404).json({ message: "Route not found." });
});

app.use((err, req, res, next) => {
    console.error("Gateway error:", err);
    if (!res.headersSent) {
        res.status(500).json({ message: "Internal gateway error." });
    }
});

app.listen(config.port, () => {
    console.log(`API Gateway запущен на порту ${config.port}`);
});
