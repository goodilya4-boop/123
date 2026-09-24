const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const legacyToken = req.headers["x-access-token"];

    let token = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.slice(7).trim();
    } else if (legacyToken) {
        token = legacyToken;
    }

    if (!token) {
        return res.status(401).send({ message: "Требуется авторизация." });
    }

    jwt.verify(
        token,
        config.secret,
        {
            algorithms: ["HS256"],
            issuer: config.issuer,
            audience: config.audience
        },
        (err, decoded) => {
            if (err) {
                return res.status(401).send({ message: "Недействительный или просроченный токен." });
            }

            req.userId = decoded.id;
            req.userRole = decoded.role;
            next();
        }
    );
};

const isAdmin = (req, res, next) => {
    if (req.userRole !== "администратор") {
        return res.status(403).send({ message: "Недостаточно прав." });
    }

    next();
};

const hasRole = (...roles) => {
    return (req, res, next) => {
        if (!req.userRole || !roles.includes(req.userRole)) {
            return res.status(403).send({ message: "Недостаточно прав." });
        }

        next();
    };
};

module.exports = {
    verifyToken,
    isAdmin,
    hasRole
};