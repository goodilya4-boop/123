const jwt = require("jsonwebtoken");
const config = require("../config");

function getToken(req) {
    const authorization = req.header("Authorization");

    if (authorization && authorization.startsWith("Bearer ")) {
        return authorization.slice(7).trim();
    }

    const legacyToken = req.header("x-access-token");
    return legacyToken ? legacyToken.trim() : null;
}

function verifyToken(req, res, next) {
    const token = getToken(req);

    if (!token) {
        return res.status(401).json({ message: "Authentication token is required." });
    }

    jwt.verify(
        token,
        config.jwt.secret,
        {
            algorithms: ["HS256"],
            issuer: config.jwt.issuer,
            audience: config.jwt.audience
        },
        (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Invalid or expired authentication token." });
            }

            req.user = decoded;
            next();
        }
    );
}

module.exports = { verifyToken };
