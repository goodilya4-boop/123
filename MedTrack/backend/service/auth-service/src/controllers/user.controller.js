const db = require("../models");
const User = db.user;
const bcrypt = require("bcryptjs");
const { z } = require("zod");

const userIdSchema = z.coerce.number().int().positive();

const selfUpdateSchema = z.object({
    first_name: z.string().trim().min(1).max(50).optional(),
    last_name: z.string().trim().min(1).max(50).optional(),
    email: z.string().trim().email().max(100).transform(value => value.toLowerCase()).optional(),
    password: z.string().min(8).max(72).optional()
}).strict();

const adminUpdateSchema = selfUpdateSchema.extend({
    role: z.enum(db.ROLES).optional()
});

exports.findAll = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ["password"] }
        });
        return res.status(200).send(users);
    } catch (error) {
        console.error("Ошибка получения списка пользователей:", error);
        return res.status(500).send({ message: "Ошибка при получении списка пользователей." });
    }
};

exports.findOne = async (req, res) => {
    const parsedId = userIdSchema.safeParse(req.params.id);

    if (!parsedId.success) {
        return res.status(400).send({ message: "Некорректный id пользователя." });
    }

    const id = parsedId.data;

    if (req.userId !== id && req.userRole !== "администратор") {
        return res.status(403).send({ message: "Недостаточно прав." });
    }

    try {
        const user = await User.findByPk(id, {
            attributes: { exclude: ["password"] }
        });

        if (!user) {
            return res.status(404).send({ message: "Пользователь не найден." });
        }

        return res.status(200).send(user);
    } catch (error) {
        console.error("Ошибка получения пользователя:", error);
        return res.status(500).send({ message: "Ошибка при получении пользователя." });
    }
};

exports.update = async (req, res) => {
    const parsedId = userIdSchema.safeParse(req.params.id);

    if (!parsedId.success) {
        return res.status(400).send({ message: "Некорректный id пользователя." });
    }

    const id = parsedId.data;
    const isAdmin = req.userRole === "администратор";
    const isSelf = req.userId === id;

    if (!isSelf && !isAdmin) {
        return res.status(403).send({ message: "Недостаточно прав." });
    }

    const schema = isAdmin ? adminUpdateSchema : selfUpdateSchema;
    const parsedBody = schema.safeParse(req.body);

    if (!parsedBody.success) {
        return res.status(400).send({
            message: "Некорректные данные пользователя.",
            errors: parsedBody.error.flatten().fieldErrors
        });
    }

    const updateData = { ...parsedBody.data };

    if (updateData.password) {
        updateData.password = bcrypt.hashSync(updateData.password, 12);
    }

    try {
        if (updateData.email) {
            const existingUser = await User.findOne({
                where: { email: updateData.email }
            });

            if (existingUser && existingUser.id !== id) {
                return res.status(409).send({ message: "Email уже используется." });
            }
        }

        const [num] = await User.update(updateData, {
            where: { id }
        });

        if (num !== 1) {
            return res.status(404).send({ message: "Пользователь не найден." });
        }

        return res.send({ message: "Пользователь успешно обновлен." });
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(409).send({ message: "Email уже используется." });
        }

        console.error("Ошибка обновления пользователя:", error);
        return res.status(500).send({ message: "Ошибка при обновлении пользователя." });
    }
};

exports.delete = async (req, res) => {
    const parsedId = userIdSchema.safeParse(req.params.id);

    if (!parsedId.success) {
        return res.status(400).send({ message: "Некорректный id пользователя." });
    }

    try {
        const num = await User.destroy({
            where: { id: parsedId.data }
        });

        if (num !== 1) {
            return res.status(404).send({ message: "Пользователь не найден." });
        }

        return res.send({ message: "Пользователь успешно удален." });
    } catch (error) {
        console.error("Ошибка удаления пользователя:", error);
        return res.status(500).send({ message: "Не удалось удалить пользователя." });
    }
};