const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
    value: String,
    doneAt: Date,
    order: Number
});

TodoSchema.virtual("todoId").get(function() {
    return this._id.toHexString();
});
//JSON 타입으로 Schema를 변환할 때 가상값(virtual)을 반환하도록 설정하는 것
TodoSchema.set("toJSON", {
    virtuals: true,
});
module.exports = mongoose.model("Todo", TodoSchema);