const express = require('express');
const app = express();
const port = 3000;
const goodsRouter = require("./routes/goods");
const connect = require("./schemas");
// const cartsRouter = require("./routes/carts");

connect();

app.use(express.json());
// localhost:3000/api -> goodsRouter
//미들웨어를 등록하는 방법 중 하나
app.use("/api", [goodsRouter]);

app.get('/', (req, res) => {
    res.send('Hello!');
});

app.listen(port, () => {
    console.log(port, '포트로 서버가 열림');
});
