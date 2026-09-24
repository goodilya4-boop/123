const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;

const Op = db.Sequelize.Op;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
    const { first_name, last_name, email, password, role } = req.body;

    if (!role) {
        return res.status(400).send({ message: "Ошибка: Роль не указана." });
    }

    if (!db.ROLES.includes(role)) {
        return res.status(400).send({ 
            message: `Ошибка: Недопустимая роль. Доступные роли: ${db.ROLES.join(', ')}` 
        });
    }

    try {
        const user = await User.create({
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: bcrypt.hashSync(password, 8),
            role: role
        });

        res.status(201).send({ 
            message: "Пользователь успешно зарегистрирован!",
            userId: user.id 
        });

    } catch (error) {
        res.status(500).send({ 
            message: error.message || "Произошла ошибка при регистрации пользователя." 
        });
    }
};

exports.signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ 
            where: { email: email } 
        });

        if (!user) {
            return res.status(404).send({ message: "Пользователь не найден." });
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password);

        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Неверный пароль!"
            });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            config.secret, 
            {
                expiresIn: 86400
            }
        );

        res.status(200).send({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role,
            accessToken: token
        });

    } catch (error) {
        res.status(500).send({ 
            message: error.message || "Ошибка при входе в систему." 
        });
    }
};