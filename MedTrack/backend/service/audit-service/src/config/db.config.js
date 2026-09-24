module.exports = {
    HOST: "176.56.14.200",
    USER: "prb01",
    PASSWORD: "prb01",
    DB: "user1",
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle:10000
    }
};