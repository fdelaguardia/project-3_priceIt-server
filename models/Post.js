const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    title: {
    type: String},
    description: {
      type: String,
    },
    price: {
      type: Number,
    },
    condition: {
      type: String,
    },
    postImages: {
      type: String,
    },
    seller: {type: Schema.Types.ObjectId, ref: "User"}
  },
  {
    timeseries: true,
    timestamps: true,
  }
);

const Post = model("Post", postSchema);

module.exports = Post;