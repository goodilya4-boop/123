require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const db = require("./models");

const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:3000")
    .split(",")
    .map(origin => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use(cookieParser());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.get("/", (req, res) => {
    res.json({ message: "Auth service is running." });
});

require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);

const PORT = Number(process.env.PORT || 8080);

db.sequelize.authenticate()
    .then(() => {
        console.log("Подключение к PostgreSQL установлено.");
        app.listen(PORT, () => {
            console.log("Сервер запущен на порту " + PORT);
        });
    })
    .catch(err => {
        console.error("Ошибка подключения к БД:", err.message);
        process.exit(1);
    });