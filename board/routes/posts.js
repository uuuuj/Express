const express = require("express");
const router = express.Router();
const posts = [
    {
      "id": 1,
      "title": "Welcome to the Board",
      "content": "This is the first post in the board. Welcome everyone to join the discussion!",
      "author": "admin",
      "created_at": "2023-11-03T10:00:00Z"
    },
    {
      "id": 2,
      "title": "Tips for Healthy Eating",
      "content": "Let's share our best healthy eating tips and recipes.",
      "author": "health_guru",
      "created_at": "2023-11-03T09:30:00Z"
    },
    {
      "id": 3,
      "title": "Photography Tips for Beginners",
      "content": "Photography can be overwhelming for beginners. Let's help each other out.",
      "author": "shutterbug",
      "created_at": "2023-11-02T16:45:00Z"
    }
  ]
  
  //전체 게시글 조회 API
  router.get("/posts", (req, res) => {
    res.json({ posts: posts });
  });

  
  module.exports = router;