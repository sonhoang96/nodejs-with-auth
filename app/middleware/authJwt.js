/*

-Để thực hiện Authen và Author, chúng ta tạo 2 hàm:

+Hàm verifyToken để kiểm tra token được cung cấp có hợp lệ hay không.
 chúng ta sẽ lấy x-access-token của http headers rồi đưa vào verify của thư viện jsonwebtoken.

+Hàm isAdmin hoặc isModerator dùng để kiểm tra trường roles của user chứa role bắt buộc hay là không.

*/
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

verifyToken = (req, res, next) => {
    //lấy thuộc tính x-access-token trong headers
    const token = req.headers["x-access-token"];
    
    if (!token) {
        return res.status(403).send({ message: "No token provided!" })
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        //Lỗi xảy ra khi kiểm tra token
        if (err) {
            return res.status(401).send({ message: "Unauthorized!" })
        }
        req.userId = decoded.id;
        next();
    })
    
}

isAdmin = async (req, res, next) => {
    try {
        const findUser = await User.findById(req.userId);

        //Kiểm tra tồn tại của user
        if(!findUser){
            res.status(500).send({ message: "Failed! User is not exist" });
            return;
        }
        else{

            //Tìm kiếm roles theo user
            const findRole = await Role.find({ _id: { $in: findUser.roles } });

            const countRoles = findRole.length;

            //Kiểm tra role admin
            for (let i = 0; i < countRoles; i++) {
                if(findRole[i].name === "admin") {  //Kiểm tra tài khoản nếu có role là admin thì sẽ tiếp tục chạy tiếp vào controller
                    next();
                    return;
                }
            }

            //Yêu cầu admin role
            res.status(403).send({mesage: "Require Admin Role"})
            return;
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

isModerator = async (req, res, next) => {
    try {
        const findUser = await User.findById(req.userId);

        //Kiểm tra tồn tại của user
        if(!findUser){
            res.status(500).send({ message: "Failed! User is not exist" });
            return;
        }
        else{

            //Tìm kiếm roles theo user
            const findRole = await Role.find({ _id: { $in: findUser.roles } });
            const countRoles = findRole.length;
            
            for (let i = 0; i < countRoles; i++) { //Kiểm tra role moderator
                findRole[i].name === "moderator" && next();
                return;
            }
            
            //Yêu cầu role moderator
            res.status(403).send({mesage: "Require Moderator Role"})
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

const authJwt = {
    verifyToken,
    isAdmin,
    isModerator
}

module.exports = authJwt;