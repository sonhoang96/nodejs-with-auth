const { verifySignUp } = require('../middleware');
const controller = require("../controllers/auth.controller");

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            "Access-Controller-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    //api signup
    app.post("/account/auth/signup",
        [
            verifySignUp.checkDuplicateUsernameOrEmail,
            verifySignUp.checkRolesExisted
        ],
        controller.signup
    )

    //api signin
    app.post("/account/auth/signin", controller.signin)
}