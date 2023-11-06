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
   * tags:
   *  - name: Posts
   *    description: "게시글 관련 API"
   * 
   *    */
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
 *  post:
 *    summary: "게시글 생성"
 *    description: "새로운 게시글을 생성합니다."
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/models/posts.js'
 *    responses:
 *      201:
 *        description: Created post data.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/models/Posts'
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
   *  /api/posts/:postid:
   *    get: 
   *      summary: "게시글 상세 조회"
   *      description: "postid를 통해 게시글을 조회한다"
   *      responses:
   *        200:
   *          description: "게시글 데이터를 반환한다"
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  posts:
   *                    type: array
   *                    items:
   *                      $ref: "#/models/Posts"
   * tags:
   *  - name: Posts
   *    description: "게시글 관련 API"
   * 
   *    */
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
  //게시글 수정 API
  /**
   * @swagger 
   * paths:
   *  /api/posts/:postid:
   *    put: 
   *      summary: "게시글 수정"
   *      description: "postid와 password를 통해 title, content를 수정한다"
   *      responses:
   *        200:
   *          description: 
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  posts:
   *                    type: array
   *                    items:
   *                      $ref: "#/models/Posts"
   * tags:
   *  - name: Posts
   *    description: "게시글 관련 API"
   * 
   *    */
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
   * paths:
   *  /api/posts/:postid:
   *    delete: 
   *      summary: "게시글 삭제"
   *      description: "postid를 통해 게시글을 조회하고, 비밀번호 입력해서 게시글 삭제"
   *      responses:
   *        200:
   *          description: 
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  posts:
   *                    type: array
   *                    items:
   *                      $ref: "#/models/Posts"
   * tags:
   *  - name: Posts
   *    description: "게시글 관련 API"
   * 
   *    */
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