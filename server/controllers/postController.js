// postController.js

const Post = require("../models/Post");

// Available categories
const categories = [
  "Technology",
  "Education",
  "Entertainment",
  "Sports",
  "Lifestyle",
  "General"
];


// CREATE POST
const createPost = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    // Check required fields
    if (!title || !content || !category) {
      return res.status(400).json({
        message: "Please provide title, content and category"
      });
    }

    // Check if category is valid
    if (!categories.includes(category)) {
      return res.status(400).json({
        message: "Invalid category",
        availableCategories: categories
      });
    }

    // Create post
    const post = await Post.create({
      title,
      content,
      category,
      author: req.user._id
    });

    // Populate author
    await post.populate("author", "name");

    res.status(201).json(post);

  } catch (error) {
    console.error("Create post error:", error.message);

    res.status(500).json({
      message: "Server error while creating post"
    });
  }
};


// GET ALL POSTS
const getAllPosts = async (req, res) => {
  try {
    const { category } = req.query;

    // Create filter object
    let filter = {};

    // If category is provided
    if (category) {

      // Validate category
      if (!categories.includes(category)) {
        return res.status(400).json({
          message: "Invalid category",
          availableCategories: categories
        });
      }

      filter.category = category;
    }

    // Fetch posts
    const posts = await Post.find(filter)
      .populate("author", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);

  } catch (error) {
    console.error("Get posts error:", error.message);

    res.status(500).json({
      message: "Server error while fetching posts"
    });
  }
};


// UPDATE POST
const updatePost = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    // Check ownership
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only edit your own posts"
      });
    }

    // Validate category if provided
    if (category && !categories.includes(category)) {
      return res.status(400).json({
        message: "Invalid category",
        availableCategories: categories
      });
    }

    // Update fields
    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category;

    // Save updated post
    const updatedPost = await post.save();

    await updatedPost.populate("author", "name");

    res.status(200).json(updatedPost);

  } catch (error) {
    console.error("Update post error:", error.message);

    res.status(500).json({
      message: "Server error while updating post"
    });
  }
};


// DELETE POST
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    // Check ownership
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only delete your own posts"
      });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Post deleted successfully"
    });

  } catch (error) {
    console.error("Delete post error:", error.message);

    res.status(500).json({
      message: "Server error while deleting post"
    });
  }
};


// GET LOGGED-IN USER'S POSTS
const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      author: req.user._id
    })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);

  } catch (error) {
    console.error("Get my posts error:", error.message);

    res.status(500).json({
      message: "Server error while fetching your posts"
    });
  }
};


// GET SINGLE POST BY ID
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "name email");

    if (!post) {
      return res.status(404).json({
        message: "Blog post not found"
      });
    }

    res.status(200).json(post);

  } catch (error) {
    console.error("Get post by ID error:", error.message);

    if (error.name === "CastError") {
      return res.status(404).json({
        message: "Blog post not found"
      });
    }

    res.status(500).json({
      message: "Server error while fetching post detail"
    });
  }
};


module.exports = {
  getAllPosts,
  getMyPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
};