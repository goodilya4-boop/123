import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

const port = Number(process.env.PORT || 3000);
const apiGatewayUrl = process.env.API_GATEWAY_URL || "http://localhost:8080";
const isProduction = process.env.NODE_ENV === "production";

app.disable("x-powered-by");

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "medtrack-frontend"
  });
});

// API Gateway proxy.
// The frontend itself is always served by Vite; no dist/ directory is used.
app.use(
  createProxyMiddleware({
    target: apiGatewayUrl,
    changeOrigin: true,
    xfwd: true,
    pathFilter: ["/api"],
    proxyTimeout: 10000,
    timeout: 10000
  })
);

const vite = await createViteServer({
  server: {
    middlewareMode: true
  },
  appType: "spa",
  mode: isProduction ? "production" : "development"
});

app.use(vite.middlewares);

app.use("*all", async (req, res, next) => {
  try {
    const url = req.originalUrl;

    const template = await vite.transformIndexHtml(
      url,
      `<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="MedTrack — медицинская информационная система" />
    <title>MedTrack</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>`
    );

    res.status(200).set({ "Content-Type": "text/html" }).end(template);
  } catch (error) {
    vite.ssrFixStacktrace(error);
    next(error);
  }
});

app.listen(port, () => {
  console.log(`MedTrack frontend: http://localhost:${port}`);
  console.log(`API Gateway: ${apiGatewayUrl}`);
});
