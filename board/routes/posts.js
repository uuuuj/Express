const express = require("express");
const { Posts } = require("../models");
const { Users } = require("../models");
const { Op } = require("sequelize");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();

  //전체 게시글 조회 API
  /**
   * @swagger 
   * paths:
   *  /api/posts:
   *    get: 
   *      summary: "전체 게시글 조회"
   *      description: "등록된 모든 게시글을 등록 날짜가 최신인 순으로 조회한다"
   *      tags:
   *        - Posts
   *      requestBody:
   *        required: false
   *      responses:
   *       '200':
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: json
   *                   example:
   *                     {
   *                        postid: 8,
   *                        title: "asdasdasdadsad",
   *                        content: "<p>여기에 새 글 입력sadsadasd</p>",
   *                        userId: 3,
   *                        createdAt: "2023-11-06T11:41:33.000Z",
   *                        updatedAt: "2023-11-06T11:41:33.000Z",
   *                        User: {
   *                           nickname: "asdasdasd"
   *                              }
   *                      }
   * 
   */
  router.get("/posts", async (req, res) => {
    const posts = await Posts.findAll({
      include: [{
        model: Users,
        attributes: ["nickname"],
      }],
      order: [["createdAt", 'DESC']]
    });
    res.json({ data: posts });
  });

 /**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: 게시글 작성
 *     description: "토큰을 검사하여, 유효한 토큰일 경우에만 게시글 작성 가능"
 *     tags:
 *       - Posts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 description: 게시글 제목
 *               content:
 *                 type: string
 *                 description: 게시글 내용
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
 *                           title: "게시글 제목", 
 *                           content: "게시글 내용" 
 *                       }    
 */
router.post("/posts", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { title, content } = req.body;
  const post = await Posts.create({ 
    userId: userId,
    title, 
    content
  });

  res.status(201).json({ data: post });
});

//NOTE - 게시글 상세 조회 API
  //게시글 상세 조회 API
  /**
   * @swagger 
   * paths:
   *  /api/posts/2:
   *    get: 
   *      summary: "게시글 상세 조회"
   *      description: "postid를 통해 게시글을 조회한다"
   *      tags:
   *       - Posts
   *      responses:
   *        200:
   *          description: "게시글 데이터를 반환한다"
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  posts:
   *                    data:
   *                      type: json
   *                      example: {
   *                           "title" : "title", 
   *                          "content" : "content",
   *                          "createdAt" : "createdAt",
   *                          "updatedAt" : "updatedAt"
   *                              }
   */
router.get('/posts/:postid', async (req, res) => {
  const { postid } = req.params;
  const post = await Posts.findOne({
    attributes: ["postid", "title", "content", "createdAt", "updatedAt"],
    include: [{
      model: Users,
      attributes: ["nickname"],
    }],
    where: { postid }
  });
  if(!post) {
    return res.status(404).json({ message: "삭제되었거나 없는 게시물입니다." });
  }

  res.status(200).json({ data: post });
});

//NOTE - 게시글 수정 API
/**
 * @swagger
 * /api/posts/11:
 *   put:
 *     summary: 게시글 수정
 *     description: "로그인 토큰을 검사하여, 해당 사용자가 작성한 게시글만 수정 가능"
 *     tags:
 *       - Posts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 description: 수정할 게시글 제목
 *               content:
 *                 type: string
 *                 description: 수정할 게시글 내용 
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
 *                           title: 2, 
 *                           content: "string" 
 *                       }
 *       '404':
 *         description: "게시글이 존재하지 않습니다."
 *       '401':
 *         description: "권한이 없습니다."
 */
router.put('/posts/:postid', authMiddleware, async (req, res) => {
  const { postid } = req.params;
  const { userId } = res.locals.user; 
  const { title, content } = req.body;

  const post = await Posts.findOne({ where: { postid } });
  if(!post) {
    return res.status(404).json({ message: '게시글이 존재하지 않습니다.' });
  }else if (post.userId !== userId) {
    return res.status(401).json({ message: '권한이 없습니다.' });
  }

  await Posts.update(
    { title, content },
    {
      where: {
        [Op.and]: [{ postid }, [{ userId: userId }]],
      }
    }
  );
  res.status(200).json({ data: "게시글이 수정되었습니다." });
});

//NOTE - 게시글 삭제 API
  //게시글 삭제 API
/**
 * @swagger
 * /api/posts/11:
 *   delete:
 *     summary: 게시글 삭제
 *     description: "로그인 토큰을 검사하여, 해당 사용자가 작성한 게시글만 삭제 가능"
 *     tags:
 *       - Posts
 *     requestBody:
 *       required: false
 * 
 *     responses:
 *       '200':
 *         description: "게시글이 삭제되었습니다."
 *       '404':
 *         description: "게시글이 존재하지 않습니다."
 *       '401':
 *         description: "권한이 없습니다."
 */
router.delete('/posts/:postid', authMiddleware, async (req, res) => {
  const { postid } = req.params;
  const { userId } = res.locals.user; 

  const post = await Posts.findOne({ where: { postid } });
  if(!post) {
    return res.status(404).json({ message: '게시글이 존재하지 않습니다.' });
  }else if (post.userId !== userId) {
    return res.status(401).json({ message: '권한이 없습니다.' });
  }

  await Posts.destroy({ 
    where: {
      [Op.and]: [{ postid }, {userId: userId}],
    }
  });

  res.status(200).json({ data: "게시글이 삭제되었습니다." });
});
  module.exports = router;