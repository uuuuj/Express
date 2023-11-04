const express = require("express");
const { Comment } = require("../models");
const { Posts } = require("../models/");
const router = express.Router();

// 댓글 조회 (해당 게시물의 모든 댓글): GET /posts/:postid/comments
// 댓글 작성 (특정 게시물에 대한 새 댓글 추가): POST /posts/:postid/comments
// 댓글 상세 조회: GET /comments/:commentid (이 경우에는 게시물 ID가 필요하지 않을 수 있습니다)
// 댓글 수정: PUT /comments/:commentid
// 댓글 삭제: DELETE /comments/:commentid

router.get("/posts/:postid/comments", async (req, res) => {
    const { postid } = req.params;
    const post = await Posts.findOne({ where: {postid } });

    if(!post) {
        return res.status(404).json({ message: '삭제되었거나 없는 게시물입니다.' });
    }
    const comments = await Comment.findAll({
        attributes: ["commentId", "writer", "content", "createdAt", "updatedAt"],
        where: { postid },
        order: [["createdAt", 'DESC']]
    });
    res.status(200).json({ data : comments });

});

router.post("/posts/:postid/comments", async (req, res) => {
    const { postid } = req.params;
    const { writer, content } = req.body;
    const post = await Posts.findOne({ where: { postid } });
    if(!post) {
        return res.status(404).json({ message: '게시글이 존재하지 않습니다.' });
    }
    if(!content) {
        return res.json({ message: "댓글 내용을 입력해주세요" });
    }
    const comment = await Comment.create({ postid, writer, content });
    
    res.status(201).json({ data: comment });
});

router.put("/comments/:commentId", async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    
    if(!content) {
        return res.json({ message: "댓글 내용을 입력해주세요" });
    } 
    const comment = await Comment.findOne({ where: { commentId } });
    if(!comment) {
        return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
    }
    
    await Comment.update(
        {content},
        {
            where: { commentId }
        }
    );
    res.status(200).json({ data: "댓글이 수정되었습니다." });

});

module.exports = router;