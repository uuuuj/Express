const express = require("express");
const { Comment } = require("../models");
const { Posts } = require("../models/");
const { Users } = require("../models/");
const { Op } = require("sequelize");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();

// 댓글 조회 (해당 게시물의 모든 댓글): GET /posts/:postid/comments
// 댓글 작성 (특정 게시물에 대한 새 댓글 추가): POST /posts/:postid/comments
// 댓글 상세 조회: GET /comments/:commentid
// 댓글 수정: PUT /comments/:commentid
// 댓글 삭제: DELETE /comments/:commentid


/**
 * @swagger
 * /api/posts/4/comments:
 *   get:
 *     summary: 댓글 조회
 *     description: 해당 게시물의 모든 댓글을 조회합니다.
 *     tags:
 *       - Comments
 *     requestBody:
 *       required: false
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: json
 *                   example: 
 *                        {
 *                           postid: 1,
 *                           title: "제목",
 *                           content: "<p>내용</p>",
 *                           userId: 3,
 *                           createdAt: "2023-11-06T11:41:33.000Z",
 *                           updatedAt: "2023-11-06T11:41:33.000Z",
 *                           User: {
 *                               nickname: "test"
 *                                 }
 *                        }
 *       '404':
 *         description: "삭제되었거나 없는 게시물입니다."
 */
router.get("/posts/:postid/comments", async (req, res) => {
    const { postid } = req.params;
    

    const post = await Posts.findOne({ where: { postid } });

    if(!post) {
        return res.status(404).json({ message: '삭제되었거나 없는 게시물입니다.' });
    }
    const comments = await Comment.findAll({
        attributes: ["commentId", "content", "createdAt", "updatedAt"],
        where: { postid },
        order: [["createdAt", 'DESC']]
    });
    res.status(200).json({ data : comments });

});

/**
 * @swagger
 * /api/posts/4/comments:
 *   post:
 *     summary: 댓글 작성
 *     description: "로그인 토큰을 검사하여, 유효한 토큰일 경우에만 댓글 작성 가능"
 *     tags:
 *       - Comments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: 댓글 내용
 *     responses:
 *       '201':
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: json
 *                   example: 
 *                        { 
 *                           userId: userId,
 *                           postid: 1, 
 *                           content: "string" 
 *                       }
 *       '404':
 *         description: "게시글이 존재하지 않습니다."
 *       '400':
 *         description: "댓글 내용을 입력해주세요."     
 */
router.post("/posts/:postid/comments", authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { postid } = req.params;
    const { content } = req.body;
    const post = await Posts.findOne({ where: { postid } });

    if(!post) {
        return res.status(404).json({ message: '게시글이 존재하지 않습니다.' });
    }

    if(!content) {
        return res.status(400).json({ message: "댓글 내용을 입력해주세요" });
    }

    const comment = await Comment.create({ 
        userId: userId,
        postid, 
        content 
    });
    
    res.status(201).json({ data: comment });
});

/**
 * @swagger
 * /api/comments/2:
 *   put:
 *     summary: 댓글 수정
 *     description: "로그인 토큰을 검사하여, 해당 사용자가 작성한 댓글만 수정 가능"
 *     tags:
 *       - Comments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: 댓글 내용
 * 
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: json
 *                   example: 
 *                        { 
 *                           userId: userId,
 *                           commentId: 2, 
 *                           content: "string" 
 *                       }
 *       '400':
 *         description: "댓글 내용을 입력해주세요."
 *       '404':
 *         description: "댓글을 찾을 수 없습니다."
 */
router.put("/comments/:commentId", authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { commentId } = req.params;
    const { content } = req.body;
    
    if(!content) {
        return res.status(400).json({ message: "댓글 내용을 입력해주세요" });
    } 
    const comment = await Comment.findOne({ where: { commentId } });
    if(!comment) {
        return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
    }
    
    await Comment.update(
        {content},
        {
            where: {
                [Op.and]: [{ commentId }, [{ userId: userId }]],
            }
        }
    );
    res.status(200).json({ data: "댓글이 수정되었습니다." });

});
/**
 * @swagger
 * /api/comments/2:
 *   delete:
 *     summary: 댓글 삭제
 *     description: "로그인 토큰을 검사하여, 해당 사용자가 작성한 댓글만 삭제 가능"
 *     tags:
 *       - Comments
 *     requestBody:
 *       required: false
 * 
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: json
 *                   example: 
 *                        { 
 *                          "message" : "댓글이 삭제되었습니다."
 *                       }
 *       '401':
 *         description: "권한이 없습니다."
 *       '404':
 *         description: "댓글을 찾을 수 없습니다."
 */
router.delete('/comments/:commentId', authMiddleware, async (req, res) => {
    const { commentId } = req.params;
    const { userId } = res.locals.user;

    const comment = await Comment.findOne({ where: { commentId } });
    if(!comment) {
        return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
    } else if (comment.userId != userId){
        return res.status(401).json({ message: '권한이 없습니다.' });
    }

    await Comment.destroy({ 
    where: {
      [Op.and]: [{ commentId }, { userId: userId }],
        }
    });

    res.status(200).json({ data: "댓글이 삭제되었습니다." });
});

module.exports = router;