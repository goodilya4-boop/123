import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createProxyMiddleware } from "http-proxy-middleware";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT || 3000);
const apiGatewayUrl = process.env.API_GATEWAY_URL || "http://localhost:8080";
const distPath = path.join(__dirname, "dist");

app.disable("x-powered-by");

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "medtrack-frontend" });
});

app.use(
  "/api",
  createProxyMiddleware({
    target: apiGatewayUrl,
    changeOrigin: true,
    xfwd: true,
    proxyTimeout: 10000,
    timeout: 10000
  })
);

app.use(express.static(distPath));

app.get("*all", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(port, () => {
  console.log(`MedTrack frontend: http://localhost:${port}`);
  console.log(`API Gateway: ${apiGatewayUrl}`);
});
