const express = require('express');
const app = express();
const port = 3000;
const postsRouter = require("./routes/posts");

//loaclhost:3000/api -> postsRouter
app.use("/api", [postsRouter]);

const { swaggerUi, specs } = require("./swagger/swagger");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs))

// route 페이지
app.get('/', (req, res) => {
    res.send('여기는 초기 페이지!');
});

app.listen(port, () =>{
    console.log(port, '포트로 서버가 열림');
});

