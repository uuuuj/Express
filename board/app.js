const express = require('express');
const cookieParser = require('cookie-parser');
const postsRouter = require("./routes/posts");
const commentsRouter = require("./routes/comments");
const usersRouter = require("./routes/users");
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;

const { sequelize } = require('./models/index.js');

// async function main() {
//   // model을 이용해 데이터베이스에 테이블을 삭제 후 생성합니다.
//   await sequelize.sync({ force: true });
// }

// main();
//cookie-parser 미들웨어
app.use(cookieParser());

app.use(express.json());

//loaclhost:3000/api -> postsRouter
app.use("/api", [postsRouter, commentsRouter, usersRouter]);
app.use(express.urlencoded({ extended: false }));

//NOTE - Swagger 연동 코드
const { swaggerUi, specs } = require("./swagger/swagger");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// route 페이지
app.get('/', (req, res) => {
    res.send('여기는 초기 페이지!');
});

//jwt를 할당한 cookie를 발급하는 API
app.post('/set-key', (req, res) => {
    const { key } = req.body;
    const token = jwt.sign({ key }, "cumstomized_secret_key");
    res.cookie('token', token);
    return res.status(200).end();

})

//jwt를 할당한 cookie를 조회하는 API
app.get('/get-key', (req, res) => {
    const { token } = req.cookies;
    const { key } = jwt.decode(token);
    return res.status(200).json({ key }); 
})

app.listen(port, () => {
    console.log(port, '포트로 서버가 열림');
});

