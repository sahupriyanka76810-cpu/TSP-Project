const Favourite = require("../models/Favourite");
const Post = require("../models/Post");

// ==========================================
// ADD POST TO FAVOURITES
// ==========================================

const addToFavourite = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.postId;

    // Check whether post already exists in favourites
    const existingFavourite = await Favourite.findOne({
      user: userId,
      post: postId,
    });

    if (existingFavourite) {
      return res.status(400).json({
        message: "Post is already in favourites",
      });
    }

    // Create favourite
    const favourite = await Favourite.create({
      user: userId,
      post: postId,
    });

    return res.status(201).json({
      message: "Post added to favourites successfully",
      favourite,
    });
  } catch (error) {
    console.error("Add favourite error:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ==========================================
// GET MY FAVOURITES
// ==========================================

const getMyFavourites = async (req, res) => {
  try {
    const userId = req.user._id;

    const favourites = await Favourite.find({
      user: userId,
    })
      .populate("post")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: favourites.length,
      favourites,
    });
  } catch (error) {
    console.error("Get favourites error:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {
  addToFavourite,
  getMyFavourites,
};