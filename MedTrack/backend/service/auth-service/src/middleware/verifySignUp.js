const db = require("../models");
const User = db.user;

const checkDuplicateEmail = async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: { email: req.body.email }
        });

        if (user) {
            return res.status(400).send({ message: "Ошибка! Email уже используется." });
        }
        next();
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

const checkRoleExisted = (req, res, next) => {
    if (req.body.role) {
        if (!db.ROLES.includes(req.body.role)) {
            return res.status(400).send({
                message: `Ошибка! Роль "${req.body.role}" не существует. Доступные роли: ${db.ROLES.join(', ')}`
            });
        }
    }
    next();
};

const verifySignUp = {
    checkDuplicateEmail,
    checkRoleExisted
};

module.exports = verifySignUp;