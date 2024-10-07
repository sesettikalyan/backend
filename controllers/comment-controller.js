const Comment = require("../models/comment.js");

const newComment = async (req, res) => {
  try {
    const newComment = await new Comment(req.body);
    newComment.save();

    res.status(200).json({ msg: "Comment posted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.id });
    res.status(200).json({ msg: "success", data: comments });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const deleteComment = async (req, res) => {
  const commentId = req.params.id;
  try {
    await Comment.findByIdAndDelete(commentId);
    return res.status(200).json({ msg: "Comment deleted successfully" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

module.exports = { newComment, getAllComments, deleteComment };
