var express = require("express"),
    bodyparser = require("body-parser"),
    cors = require("cors"),
    app = express(),
    corsOptions = {
        origin: "http://localhost:8080"
    };

app.use(cors(corsOptions));

// Phân tích các các loại nội dung ( content-type: application/json ) của request gửi sang
app.use(express.json());

// Phân tích các các loại nội dung ( content-type: application/x-www-form-urlencoded ) của request gửi sang
app.use(express.urlencoded({ extended: true }));

// Thiết lập đường dẫn cơ bản
app.get("/", (req, res) => {
    res.send({ message: "Authentication" });
})

//routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

// tạo PORT để lắng nghe các request
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})

// config của db
const dbConfig = require("./app/config/db.config");

//Gọi Object db từ file index.js thuộc thư mục model
const db = require("./app/models");

//Trỏ vào db lấy model Role
const Role = db.role

// Thiết lập kết nối với MongoDB
db.mongoose.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Successfully connect to Database");
        //Hàm initial tự thêm 3 role admin, user và moderator nếu DB rỗng
        initial();
    })
    .catch(err => {
        console.error("Connection error", error);
        process.exit();
    });

function initial() {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {

            //Tạo mới role user
            new Role({
                name: "user"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'user' to roles collection");
            });

            //Tạo mới role moderator
            new Role({
                name: "moderator"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'moderator' to roles collection");
            });

            //Tạo mới role admin
            new Role({
                name: "admin"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'admin' to roles collection");
            });
        }
    });
}
