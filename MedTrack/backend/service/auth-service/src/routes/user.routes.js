const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Authorization, x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/users", [authJwt.verifyToken, authJwt.isAdmin], controller.findAll);
    app.get("/api/users/:id", [authJwt.verifyToken], controller.findOne);
    app.put("/api/users/:id", [authJwt.verifyToken], controller.update);
    app.delete("/api/users/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.delete);
};