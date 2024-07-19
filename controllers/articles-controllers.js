const { fetchArticleById, fetchArticles, fetchArticleComments, insertArticleComments } = require('../models/articles-models')

const getArticleById = (req, res, next) => {
    const { article_id } = req.params
    fetchArticleById(article_id).then((article) => {
        res.status(200).send({ article })
    })
    .catch((err) => {
        next(err)
    })
}

const getArticles = (req, res, next) => {
    fetchArticles().then((articles) => {
        res.status(200).send({articles: articles})
    }).catch((err) => {
        next(err)
    })
}

// REVISE LATER

const getArticleComments = (req, res, next) => {
    let { order, limit, p } = req.query
    const article_id = Number(req.params.article_id)
    const validOrderOptions = ['asc', 'desc'];
    if (order && !validOrderOptions.includes(order.toLowerCase()))
      next({ status: 400, msg: 'bad request >:(' })
  
    fetchArticleComments(article_id, order, limit, p)
      .then((comments) => {
        res.status(200).send({ comments })
      })
      .catch((err) => {
        next(err)
      })
}

const postArticleComments = (req, res, next) => {

  const { article_id } = req.params

  const { author, body } = req.body

  // I'll find a way of creating an error handling module over the weekend
  
  return insertArticleComments(article_id, author, body)
  .then((comments) => {
    res.status(201).send({ comments })})
  .catch(next)
  }

module.exports = { getArticleById, getArticles, getArticleComments, postArticleComments }