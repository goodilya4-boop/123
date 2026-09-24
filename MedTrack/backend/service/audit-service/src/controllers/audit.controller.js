const db = require("../models");
const Audit = db.audit;
const Access = db.access;
const { z } = require("zod");

const createSchema = z.object({
    user_id: z.coerce.number().int().positive(),
    user_event: z.string().trim().min(1).max(50),
    user_access: z.coerce.number().int().positive(),
    time_start: z.coerce.date().optional(),
    time_end: z.coerce.date().optional()
}).strict();

const querySchema = z.object({
    user_id: z.coerce.number().int().positive().optional(),
    user_event: z.string().trim().min(1).max(50).optional(),
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
    limit: z.coerce.number().int().min(1).max(100).default(50),
    offset: z.coerce.number().int().min(0).default(0)
});

exports.create = async (req, res) => {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).send({ message: "Некорректные данные аудита.", errors: parsed.error.flatten().fieldErrors });
    }

    const data = parsed.data;
    if (req.userRole !== "администратор" && data.user_id !== req.userId) {
        return res.status(403).send({ message: "Нельзя создавать аудит от имени другого пользователя." });
    }

    try {
        const access = await Access.findByPk(data.user_access);
        if (!access) return res.status(400).send({ message: "Запись доступа не найдена." });

        const audit = await Audit.create({
            ...data,
            time_start: data.time_start || null,
            time_end: data.time_end || new Date()
        });

        return res.status(201).send(audit);
    } catch (error) {
        console.error("Ошибка создания записи аудита:", error);
        return res.status(500).send({ message: "Ошибка создания записи аудита." });
    }
};

exports.findAll = async (req, res) => {
    const parsed = querySchema.safeParse(req.query);
    if (!parsed.success) {
        return res.status(400).send({ message: "Некорректные параметры поиска.", errors: parsed.error.flatten().fieldErrors });
    }

    const { user_id, user_event, from, to, limit, offset } = parsed.data;
    const where = {};
    if (user_id) where.user_id = user_id;
    if (user_event) where.user_event = user_event;

    if (from || to) {
        where.time_end = {};
        if (from) where.time_end[db.Sequelize.Op.gte] = from;
        if (to) where.time_end[db.Sequelize.Op.lte] = to;
    }

    if (req.userRole !== "администратор") {
        where.user_id = req.userId;
    }

    try {
        const result = await Audit.findAndCountAll({
            where,
            include: [{ model: Access, as: "access_right", attributes: ["id", "user_id", "access"] }],
            order: [["time_end", "DESC"]],
            limit,
            offset
        });

        return res.status(200).send(result);
    } catch (error) {
        console.error("Ошибка получения аудита:", error);
        return res.status(500).send({ message: "Ошибка получения аудита." });
    }
};