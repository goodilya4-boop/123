const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;
var bcrypt = require("bcryptjs");

exports.findAll = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({ message: error.message || "Ошибка при получении списка пользователей." });
    }
};

exports.findOne = async (req, res) => {
    const id = req.params.id;

    try {
        const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).send({ message: `Пользователь с id=${id} не найден.` });
        }

        res.status(200).send(user);
    } catch (error) {
        res.status(500).send({ message: "Ошибка при получении пользователя с id=" + id });
    }
};

exports.update = async (req, res) => {
    const id = req.params.id;
    
    let updateData = { ...req.body };

    try {
        if (updateData.role) {
            if (!db.ROLES.includes(updateData.role)) {
                return res.status(400).send({ 
                    message: `Ошибка: Недопустимая роль. Доступные роли: ${db.ROLES.join(', ')}` 
                });
            }
        }

        if (updateData.password) {
            updateData.password = bcrypt.hashSync(updateData.password, 8);
        }

        const [num] = await User.update(updateData, {
            where: { id: id }
        });

        if (num === 1) {
            res.send({ message: "Пользователь успешно обновлен." });
        } else {
            res.send({ 
                message: `Невозможно обновить пользователя с id=${id}. Возможно, пользователь не найден или данные не изменились.` 
            });
        }
    } catch (error) {
        res.status(500).send({ message: "Ошибка при обновлении пользователя с id=" + id });
    }
};

exports.delete = async (req, res) => {
    const id = req.params.id;

    try {
        const num = await User.destroy({
            where: { id: id }
        });

        if (num == 1) {
            res.send({ message: "Пользователь успешно удален." });
        } else {
            res.send({ message: `Невозможно удалить пользователя с id=${id}. Возможно, он не найден.` });
        }
    } catch (error) {
        res.status(500).send({ message: "Не удалось удалить пользователя с id=" + id });
    }
};

exports.deleteAll = async (req, res) => {
    try {
        const nums = await User.destroy({
            where: {},
            truncate: false
        });

        res.send({ message: `Успешно удалено ${nums} пользователей.` });
    } catch (error) {
        res.status(500).send({ message: "Ошибка при удалении всех пользователей." });
    }
};