const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { z } = require("zod");

const signupSchema = z.object({
    first_name: z.string().trim().min(1).max(50),
    last_name: z.string().trim().min(1).max(50),
    email: z.string().trim().email().max(100).transform(value => value.toLowerCase()),
    password: z.string().min(8).max(72)
});

const signinSchema = z.object({
    email: z.string().trim().email().max(100).transform(value => value.toLowerCase()),
    password: z.string().min(1).max(72)
});

exports.signup = async (req, res) => {
    const parsed = signupSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).send({
            message: "Некорректные данные регистрации.",
            errors: parsed.error.flatten().fieldErrors
        });
    }

    const { first_name, last_name, email, password } = parsed.data;

    try {
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(409).send({ message: "Email уже используется." });
        }

        const user = await User.create({
            first_name,
            last_name,
            email,
            password: bcrypt.hashSync(password, 12),
            role: db.DEFAULT_ROLE
        });

        return res.status(201).send({
            message: "Пользователь успешно зарегистрирован!",
            userId: user.id,
            role: user.role
        });
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(409).send({ message: "Email уже используется." });
        }

        console.error("Ошибка регистрации:", error);
        return res.status(500).send({
            message: "Произошла ошибка при регистрации пользователя."
        });
    }
};

exports.signin = async (req, res) => {
    const parsed = signinSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).send({ message: "Некорректные данные входа." });
    }

    const { email, password } = parsed.data;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).send({
                accessToken: null,
                message: "Неверный email или пароль."
            });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            config.secret,
            {
                expiresIn: config.expiresIn,
                issuer: config.issuer,
                audience: config.audience,
                algorithm: "HS256"
            }
        );

        return res.status(200).send({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role,
            accessToken: token
        });
    } catch (error) {
        console.error("Ошибка входа:", error);
        return res.status(500).send({
            message: "Ошибка при входе в систему."
        });
    }
};