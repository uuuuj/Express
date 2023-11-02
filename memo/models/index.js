//Mongoose 라이브러리를 가져와서 mongoose 변수에 할당
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/todo-demo", {
    //새로운 Url 파싱 엔진과 새로운 연결 관리 엔진을 사용하도록 설정
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(value => console.log("MongoDB 연결에 성공"))
    .catch(reason => console.log("MongoDB 연결에 실패"))
//데이터 베이스 연결 객체를 가져와 db 변수에 할당한다
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

module.exports = db;