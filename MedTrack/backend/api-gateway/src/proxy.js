const { createProxyMiddleware } = require("http-proxy-middleware");

function createServiceProxy(target) {
    return createProxyMiddleware({
        target,
        changeOrigin: true,
        xfwd: true,
        proxyTimeout: 10000,
        timeout: 10000,
        on: {
            proxyReq(proxyReq, req) {
                if (req.headers.authorization) {
                    proxyReq.setHeader("Authorization", req.headers.authorization);
                }

                if (req.headers["x-access-token"]) {
                    proxyReq.setHeader("x-access-token", req.headers["x-access-token"]);
                }
            },
            error(err, req, res) {
                if (!res.headersSent) {
                    res.status(502).json({
                        message: "Upstream service is unavailable.",
                        serviceError: err.code || "proxy_error"
                    });
                }
            }
        }
    });
}

module.exports = { createServiceProxy };
