const express = require("express");
const todosRouter = require("./routes/todos.router.js");
const app = express();

app.use("/api", express.json(), todosRouter);
app.use(express.static("./assets"));
// app.use("/api", express.json(), todosRouter);


app.listen(8080, () => {
  console.log("서버가 켜졌어요!");
});

