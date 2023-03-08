const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    title: String,
    description: String,
    price: Number,
    condition: String,
    postImages: String,
    seller: {type: Schema.Types.ObjectId, ref: "User"}
  },
  {
    timeseries: true,
    timestamps: true,
  }
);

const Post = model("Post", postSchema);

module.exports = Post;