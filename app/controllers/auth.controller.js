/*
Có 2 chức năng cho việc authentication:

+Hàm signup để tạo mới user

+Hàm signin để đăng nhập tài khoản thông qua user và pasword, sử dụng hàm bcrypt để so sánh 2 password.
tạo ra token rồi phản hồi thông tin user và token về

*/
const config = require("../config/auth.config");
const db = require("../models")
const User = db.user;
const Role = db.role;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { user } = require("../models");

//Xử lí đăng kí
exports.signup = async (req, res) => {
    try {
        const { username, email, password, roles } = req.body;
        const user = new User({
            username,
            email,
            password: bcrypt.hashSync(password, 8)
        })

        await user.save();

        if (roles) {
            const findRole = await Role.find({ name: { $in: roles } });

            user.roles = findRole.map(role => role._id);
            await user.save();

            res.send({ message: "User was registered successfully!" })
        } else {
            const findRole = await Role.find({ name: { $in: roles } });

            user.roles = [findRole._id];
            await user.save();

            res.send({ message: "User was registered successfully!" });
        }

    } catch (error) {
        res.status(500).send({ message: error });
    }
}

//Xử lí đăng nhập
exports.signin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const findUser = await User.findOne({ username }).populate("roles", "-__v");
        if (!findUser) {
            return res.status(404).send({ message: "User Not found." });
        }
        
        //So sánh password được gửi tới và password trong db
        const passwordIsValid = bcrypt.compareSync(password, findUser.password);
        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password!"
            });
        }
        
        const token = jwt.sign({id: findUser.id}, config.secret, {
            //Thời gian tồn tại của token
            expiresIn: 43200 // mili giây => 12h
        })
        const listAuthority = []; // Danh sách role của user
        const countRole = findUser.roles.length;
        for(let i = 0; i < countRole; i++){
            console.log(countRole)
            let role = findUser.roles[i].name.toUpperCase();
            listAuthority.push("ROLE_" + role)
        }
        res.status(200).send({
            id: findUser._id,
            username: findUser.username,
            email: findUser.email,
            roles: listAuthority,
            accessToken: token 
        })
    } catch (error) {
        res.status(500).send({ message: error });
    }
}