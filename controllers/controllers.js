const endpoints = require("../endpoints.json");
const {
  fetchArticleById,
  fetchArticles,
  fetchTopics,
  fetchCommentByArticleId,
  insertCommentByArticleId,
  patchArticleVotes,
  deleteComment,
  fetchUsers
} = require("../models/models.js");

exports.getApi = (req, res) => {
  res.status(200).send({ endpoints: endpoints });
};

exports.getTopics = (req, res, next) => {
  fetchTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {

  const { topic, sort_by, order } = req.query

  fetchArticles(topic, sort_by, order)
    .then((articles) => {
      res.status(200).send({ articles: articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
   return fetchArticleById(article_id)
     .then(() => {
      return fetchCommentByArticleId(article_id);
    })
    .then((comments) => {
      res.status(200).send({ comments: comments });
    })
    .catch((err) => {
      next(err);
    });
 };

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { author, body } = req.body;

  // DEBUGGING START

  console.log('Article ID:', article_id);
  console.log('Author:', author);
  console.log('Body:', body);

  // DEBUGGING END

  return insertCommentByArticleId(article_id, author, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.updateArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  return patchArticleVotes(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.deleteCommentByCommentId = (req, res, next) => {
  const { comment_id } = req.params;
  deleteComment(comment_id)
    .then(() => {
      res.status(204).send({});
    })
    .catch(next);
};

exports.getUsers = (req, res, next) => {
    fetchUsers().then((users) => {
      res.status(200).send({ users });
    });
  };