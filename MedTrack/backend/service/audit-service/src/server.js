require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./models");

const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:3000")
    .split(",").map(v => v.trim()).filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "25kb" }));

app.get("/", (req, res) => {
    res.json({ message: "Audit service is running." });
});

require("./routes/audit.routes")(app);

const PORT = Number(process.env.PORT || 8081);

db.sequelize.authenticate()
    .then(() => {
        console.log("Подключение к PostgreSQL установлено.");
        app.listen(PORT, () => console.log("Audit service запущен на порту " + PORT));
    })
    .catch(err => {
        console.error("Ошибка подключения к БД:", err.message);
        process.exit(1);
    });