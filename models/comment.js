const { Module } = require("module");
const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  postId: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
});

const comment = mongoose.model("comment", commentSchema);

module.exports = comment;
