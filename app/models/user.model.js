const mongoose = require("mongoose");
const {Schema, model} = mongoose;
const User = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        default: ""
    },
    password: {
        type: String,
        required: true
    },
    roles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role"
        }
    ]
})

module.exports = model("User", User)