module.exports = {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    DB: process.env.DB_NAME,
    PORT: Number(process.env.DB_PORT || 5432),
    dialect: "postgres",
    pool: {
        max: Number(process.env.DB_POOL_MAX || 5),
        min: Number(process.env.DB_POOL_MIN || 0),
        acquire: Number(process.env.DB_POOL_ACQUIRE || 30000),
        idle: Number(process.env.DB_POOL_IDLE || 10000)
    }
};

if (!module.exports.HOST || !module.exports.USER || !module.exports.PASSWORD || !module.exports.DB) {
    throw new Error("Database configuration is incomplete. Set DB_HOST, DB_USER, DB_PASSWORD and DB_NAME.");
}