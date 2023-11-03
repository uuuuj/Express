const express = require("express");
const db = require("./models/index.js");
const todosRouter = require("./routes/todos.router.js");
const app = express();
const cookieParser = require('cookie-parser');
let session = {};

app.use(cookieParser());    // cookie-parser 미들웨어를 전역으로 사용하기 위함
app.use("/api", express.json(), todosRouter);

app.get("/set-cookie", (req, res) => {
    let expires = new Date();
    expires.setMinutes(expires.getMinutes()+60); //만료 시간을 60분으로 설정
    
    res.cookie('name', 'sparta', {
        expires: expires
    });
    return res.status(200).end();
});
// /get-cookie에 접근했을 때, 클라이언트가 전달한 모든 쿠키를 출력하는 API
app.get("/get-cookie", (req, res) => {
    const cookie = req.headers.cookie;
    console.log(cookie);    // {name='sparta'}
    return res.status(200).json({cookie});
})

app.get('/set-session', function(req, res, next) {
    const name = 'sparta';
    const uniqueInt = Date.now();
    session[uniqueInt] = { name };

    res.cookie('sessionKey', uniqueInt);
    return res.status(200).end();
});

app.get('/get-session', function(req, res, next) {
    const { sessionKey } = req.cookies;
    const name = session[sessionKey];
    return res.status(200).json({ name });
});
app.use(express.static("./assets"));
// app.use("/api", express.json(), todosRouter);


app.listen(8080, () => {
  console.log("서버가 켜졌어요!");
});



