const Post = require("../models/post.js");

const createPost = async (req, res) => {
  try {
    const post = await new Post(req.body);
    post.save();

    return res.status(200).json({ msg: "post saved successfully" });
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
};

const getPosts = async (req, res) => {
  try {
    const { category } = req.query;

    const filter = category ? { categories: category } : {};
    const posts = await Post.find(filter);
    return res.status(200).json({ msg: "success", data: posts });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    return res.status(200).json({ msg: "success", data: post });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    return res
      .status(200)
      .json({ msg: "Post updated successfully", data: updatedPost });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const deletePost = async (req, res) => {
  const postId = req.params.id;
  try {
    await Post.findByIdAndDelete(postId);
    return res.status(200).json({ msg: "Post deleted successfully" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

module.exports = { createPost, getPosts, getPost, updatePost, deletePost };
