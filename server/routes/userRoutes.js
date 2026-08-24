const express = require("express");

const router = express.Router();

const {
  addToFavourite,
  getMyFavourites,
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");

// Add a post to favourites
router.post(
  "/favourites/:postId",
  protect,
  addToFavourite
);

// Get logged-in user's favourite posts
router.get(
  "/favourites",
  protect,
  getMyFavourites
);

module.exports = router;