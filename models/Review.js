const { Schema, model } = require("mongoose");

const reviewSchema = new Schema(
  {
      rates: String,
      review: [{ type: String, maxlength: 200 }],
      seller: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timeseries: true,
    timestamps: true,
  }
);

const Review = model("Review", reviewSchema);

module.exports = Review;