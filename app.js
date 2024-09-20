const cors = require('cors');
const express = require("express");
const app = express();
const {
  getTopics,
  getApi,
  getArticleById,
  getArticles,
  getCommentByArticleId,
  postCommentByArticleId,
  updateArticleVotes,
  deleteCommentByCommentId,
  getUsers
} = require("./controllers/controllers");

// CORS CONFIG - FOR DEBUGGING

const corsOptions = {
  origin: '*', // Allow all origins
  methods: '*', // Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
  allowedHeaders: '*', // Allow all headers
};

app.use(cors(corsOptions));

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api", getApi);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentByArticleId);
app.post("/api/articles/:article_id/comments", postCommentByArticleId);
app.patch("/api/articles/:article_id", updateArticleVotes);
app.delete("/api/comments/:comment_id", deleteCommentByCommentId);
app.get("/api/users", getUsers)

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "bad request >:(" });
  } else {
    next(err);
  }
})

app.use((err, req, res, next) => {
  if (err.code === "23503"){
    res.status(404).send({ msg: "not found :(" })
  } else {
    next(err)
  }
})

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
})

module.exports = app;