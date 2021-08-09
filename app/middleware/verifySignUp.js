/*

-Để kiểm tra hành động đăng kí tài khoản, ở đây ta tạo 2 hàm:

+Hàm kiểm tra trùng lặp tên đăng nhập và email (checkDuplicateUsernameOrEmail).

+Hàm kiểm tra role khi nhận request có hợp lệ hay không (checkRolesExisted).

*/

const db = require('../models')
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameOrEmail = async (req, res, next) => {
    try {
        const findUser = await User.findOne({ username: req.body.username });
        const findEmail = await User.findOne({ email: req.body.email });
        //Nếu username đã tồn tại
        if (findUser) {
            res.status(400).send({ message: 'Failed! Username is already in use!' });
            return;
        }
        //Nếu email đã tồn tại
        else if (findEmail) {
            res.status(400).send({ message: "Failed! Email is already in use!" });
            return;
        }
        else {
            return next();
        }
    } catch (error) {
        res.status(500).send({ message: err });
    }
}

checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!ROLES.includes(req.body.roles[i])) {
                res.status(400).send({
                    message: `Failed! Role ${req.body.roles[i]} does not exist!`
                });
                return;
            }
        }
    }
    next();
};

const verifySignUp = {
    checkDuplicateUsernameOrEmail,
    checkRolesExisted
}

module.exports = verifySignUp;