const express = require("express");
const router = express.Router();

const {
  getAllPosts,
  getMyPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
} = require("../controllers/postController");

const {
  addToFavourite
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");

router.post("/", protect, createPost);

router.get("/", getAllPosts);

router.get("/my-posts", protect, getMyPosts);

router.get("/:id", getPostById);

router.put("/:id", protect, updatePost);

router.delete("/:id", protect, deletePost);

router.post("/:id/favourite", protect, addToFavourite);

module.exports = router;