const { verifyToken, isAdmin } = require("../middleware/authjwt");
const controller = require("../controllers/audit.controller");

module.exports = function(app) {
    app.get("/api/audit", verifyToken, controller.findAll);
    app.post("/api/audit", verifyToken, controller.create);
    app.get("/api/audit/admin", verifyToken, isAdmin, controller.findAll);
};