const { fetchArticleById } = require('../models/articles-models')
const { fetchArticles } = require('../models/articles-models')
const { fetchArticleComments } = require('../models/articles-models')

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

module.exports = { getArticleById, getArticles, getArticleComments }