const config = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
    host: config.HOST,
    port: config.PORT,
    dialect: config.dialect,
    pool: config.pool,
    define: { schema: "MedTrack" },
    logging: false
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.audit = require("./audit.model.js")(sequelize, Sequelize);
db.access = require("./access.model.js")(sequelize, Sequelize);

db.access.hasMany(db.audit, {
    foreignKey: "user_access",
    as: "audit_logs"
});
db.audit.belongsTo(db.access, {
    foreignKey: "user_access",
    as: "access_right"
});

module.exports = db;