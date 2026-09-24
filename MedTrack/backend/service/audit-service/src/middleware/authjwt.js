const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");

const verifyToken = (req, res, next) => {
    const header = req.headers.authorization;
    const legacyToken = req.headers["x-access-token"];
    let token = header && header.startsWith("Bearer ") ? header.slice(7).trim() : legacyToken;

    if (!token) {
        return res.status(401).send({ message: "Требуется авторизация." });
    }

    try {
        const decoded = jwt.verify(token, config.secret, {
            algorithms: ["HS256"],
            issuer: config.issuer,
            audience: config.audience
        });

        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    } catch (error) {
        return res.status(401).send({ message: "Недействительный или просроченный токен." });
    }
};

const isAdmin = (req, res, next) => {
    if (req.userRole !== "администратор") {
        return res.status(403).send({ message: "Недостаточно прав." });
    }
    next();
};

module.exports = { verifyToken, isAdmin };