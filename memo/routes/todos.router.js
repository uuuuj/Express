const express = require("express");
const router = express.Router();
const Todo = require("./models/todo");

router.get("/", (req, res) => {
  res.send("Hi! api");
});

//할일 추가 API
router.post("/todos", async (req, res) => {
    const { value } = req.body;
    //await -> 연산이 완료될 때까지 함수의 실행을 일시 중단
    //-order 내림차순 정렬
    const maxOrderByUserId = await Todo.findOne().sort("-order").exec();
    //만약 기존 Todo 항목이 있다면,(maxOrderByUserId가 true인 경우), 가장 높은 order 값에 1을 더한 값을 새로운 Todo 항목의 order 값으로 설정
    const order = maxOrderByUserId ? maxOrderByUserId.order + 1 : 1;
    const todo = new Todo({ value, order });
    await todo.save();
    //저장된 Todo 객체를 응답으로 클라이언트에 전송
    res.send({ todo });
})

//할 일 목록 가져오는 API
router.get("/todos", async(req, res) => {
    const todos = await Todo.find().sort("-order".exec());

    res.send({ todos });
})

//할일 순서 변경하는 API
router.patch("/todos/:todoId", async (req, res) => {
    const { todoId } = req.params;
    const { order } = req.body;

    const currentTodo = await Todo.findById(todoId);
    if(!currentTodo) {
        throw new Error("존재하지 않는 todo 데이터입니다.");
    }
    if(order) {
        const targetTodo = await Todo.findOne({ order }).exec();
        if(targetTodo) {
            targetTodo.order = currentTodo.order;
            await targetTodo.save();
        }
        currentTodo.order = order;
    }

    await currentTodo.save();

    res.send({});
});

//할 일 삭제 API
router.delete("/todos/:todoId", async (req, res) => {
    const { todoId } = req.params;

    const existsTodo = await Todo.findById(todoId);

    if(existsTodo) {
        await Todo.deleteOne({ _id : todoId });
        res.status(200).json({ message: '할 일 삭제 완료!'});
    }
    else{
        res.status(400).json({ errormessage: '존재하지 않는 할 일 입니다.'});
    }

})

//할일 내용 및 체크 박스 수정 API
router.patch("/todos/:todoId", async (req, res) => {
    const { todoId } = req.params;
    const { value } = req.body;
    const { done } = req.body;

    const modifyTodo = await Todo.findById(todoId);

    if(!modifyTodo) {
        throw new Error("존재하지 않는 todo 데이터 입니다.");
    }
    
    if(modifyTodo) {
        await Todo.updateOne({ todoId: todoId}, {$set: { value }});
    }

    res.send({});
})

//체크 박스 수정 API
router.patch("/todos/:todoId", async (req, res) => {
    const { todoId } = req.params;
    const { done } = req.body;

    const modifyTodo = await Todo.findById(todoId);

    if(modifyTodo) {
        if(done == true){
            await Todo.updateOne({ todoId: todoId }, { $set: { done } });
        } else{
            await Todo.updateOne({ todoId: todoId }, { $set: { done } });
        }
        
    }
    res.send({});
})

module.exports = router;