const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  serverType: { type: String, required: true },
  subCategory: { type: String, required: true },
  env: { type: String, required: true },
  comments: { type: Object, required: true },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;