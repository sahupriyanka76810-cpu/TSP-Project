const mongoose = require("mongoose");

const favouriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Prevent the same user from favouriting the same post twice
favouriteSchema.index(
  { user: 1, post: 1 },
  { unique: true }
);

module.exports = mongoose.model("Favourite", favouriteSchema);