const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const db = require("./models");

const app = express();

// CORS
var corsOptions = {
    origin: "http://localhost:3000"
};
app.use(cors(corsOptions));
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({ message: "Auth service is running." });
});

require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);

const PORT = process.env.PORT || 8080;

db.sequelize.authenticate()
    .then(() => {
        console.log("Подключение к PostgreSQL установлено.");
        app.listen(PORT, () => {
            console.log(`Сервер запущен на порту ${PORT}`);
        });
    })
    .catch(err => {
        console.error("Ошибка подключения к БД:", err.message);
    });