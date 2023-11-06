const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            version: "1.0.0",
            title: "나만무 준비 프로젝트",
            description: 
                "나만무 준비 express 게시판 만들기 프로젝트"
        },
        servers: [
            {
                url: "http://bumkyulee.store", //요청 URL
            },
        ],
    },
    apis: ["./routes/users.js", "./routes/posts.js", "./routes/comments.js", "./routes/index.js"], //Swagger 파일 연동
}
const specs = swaggerJsdoc(options)

module.exports = { swaggerUi, specs }