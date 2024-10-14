const express = require("express");
const Router = express.Router();
const {
  signUpUser,
  loginUser,
  getSolanaData,
} = require("../controllers/user-controller.js");
const {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
} = require("../controllers/post-controller.js");
const authenticateToken = require("../controllers/jwt-controller.js");
const {
  newComment,
  getAllComments,
  deleteComment,
} = require("../controllers/comment-controller.js");
const {
  signUpFlightUser,
  loginFlightUser,
} = require("../controllers/flight-user-controller.js");

{
  /* blog-management-backend */
}
Router.post("/signup", signUpUser);
Router.post("/login", loginUser);
Router.post("/create", authenticateToken, createPost);
Router.get("/posts", authenticateToken, getPosts);
Router.get("/post/:id", authenticateToken, getPost);
Router.put("/update/:id", authenticateToken, updatePost);
Router.delete("/posts/:id", authenticateToken, deletePost);
Router.post("/comment/new", authenticateToken, newComment);
Router.get("/comments/:id", authenticateToken, getAllComments);
Router.delete("/delete-comment/:id", authenticateToken, deleteComment);

{
  /* flight-reservation-system-backend */
}
Router.post("/flight/signup", signUpFlightUser);
Router.post("/flight/signin", loginFlightUser);

//test route
Router.get("/solana/:address", getSolanaData);
module.exports = Router;
