/*
3 Role ( vai trò hay còn gọi là quyền của tài khoản ):
+User ( Tài khoản thường )
+Moderator ( Tài khoản có khả năng chỉnh sửa nội dung của hệ thống - cấp nhân viên hệ thống )
+Admin ( Tài khoản quản trị - cấp quản lí )

** User < Morderator < Admin **
*/
const mongoose = require("mongoose");
const {Schema, model} = mongoose;
const Role = new Schema({
    name: String
})

module.exports = model("Role", Role)