const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller")

module.exports = (app) => {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    //test api
    app.get("/account/test/all", controller.allAccess);

    //test user
    app.get("/account/test/user", [authJwt.verifyToken], controller.userBoard)

    //test moderator
    app.get(
        "/account/test/mod",
        [authJwt.verifyToken, authJwt.isModerator],
        controller.moderatorBoard
    );

    //test admin
    app.get(
        "/account/test/admin",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.adminBoard
    );
}