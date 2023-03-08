const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
    type: String,
    required: true,
    unique: true
    },
    password: {
      type: String,
      required: true,
    },
    firstName: String,
    lastName: String,
    profileImage: String,
    state: String,
    city: String,
    posts: [{type: Schema.Types.ObjectId, ref: "Post"}],
    reviews: [{type: Schema.Types.ObjectId, ref: "Review"}],
  },
  {
    timeseries: true,
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
