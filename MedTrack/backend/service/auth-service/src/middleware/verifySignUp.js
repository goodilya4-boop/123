const db = require("../models");

const checkDuplicateEmail = async (req, res, next) => {
    try {
        const email = typeof req.body.email === "string"
            ? req.body.email.trim().toLowerCase()
            : req.body.email;

        const user = await db.user.findOne({ where: { email } });

        if (user) {
            return res.status(409).send({ message: "Email уже используется." });
        }

        next();
    } catch (error) {
        console.error("Ошибка проверки email:", error);
        return res.status(500).send({ message: "Ошибка проверки email." });
    }
};

const verifySignUp = {
    checkDuplicateEmail
};

module.exports = verifySignUp;