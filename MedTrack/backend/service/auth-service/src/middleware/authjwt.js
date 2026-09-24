const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

const verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({ message: "Токен не предоставлен!" });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Неавторизованный доступ!" });
        }
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
};

const isAdmin = (req, res, next) => {
    if (req.userRole !== 'администратор') {
        return res.status(403).send({ message: "Требуется роль Администратор!" });
    }
    next();
};

const hasRole = (...roles) => {
    return (req, res, next) => {
        if (!req.userRole || !roles.includes(req.userRole)) {
            return res.status(403).send({ 
                message: `Требуется одна из ролей: ${roles.join(', ')}` 
            });
        }
        next();
    };
};

const authJwt = {
    verifyToken,
    isAdmin,
    hasRole
};

module.exports = authJwt;