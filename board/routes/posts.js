const express = require("express");
const { Posts } = require("../models");
const router = express.Router();
  
  //전체 게시글 조회 API
  /**
   * @swagger 
   * paths:
   *  /api/posts:
   *    get: 
   *      summary: "전체 게시글 조회"
   *      description: "등록된 모든 게시글을 조회한다"
   *      response:
   *        200:
   *          description: A list of posts.
   *          content:
   *            application/json:
   *              schema:
   *                type: dbject
   *                properties:
   *                  posts:
   *                    type: array
   *                    items:
   *                      $ref: "#/components/schemas/Post"
   * tags:
   *  - name: Posts
   *    description: "게시글 관련 API"
   * 
   *    */
  router.get("/posts", (req, res) => {
    res.json({ posts: posts });
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
 *            $ref: '#/components/schemas/Post'
 *    responses:
 *      201:
 *        description: Created post data.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Post'
 */
router.post("/posts", async (req, res) => {
  const { title, content, writer, password } = req.body;
  const post = await Posts.create({ title, content, writer, password });

  res.status(201).json({ data: post });
});

//NOTE - 게시글 상세 조회 API
router.get('/posts/:postid', async (req, res) => {
  const { postid } = req.params;
  const post = await Posts.findOne({
    attributes: ["postid", "title", "content", "createdAt", "updatedAt"],
    where: { postid }
  });

  res.status(200).json({ data: post });
});

  module.exports = router;