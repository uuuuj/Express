const express = require("express");
const { Posts } = require("../models");
const router = express.Router();
  
  //전체 게시글 조회 API
  /**
   * @swagger 
   * /api/posts/get:
   *  get: "전체 게시글 조회"*/
  router.get("/posts", (req, res) => {
    res.json({ posts: posts });
  });

  module.exports = router;