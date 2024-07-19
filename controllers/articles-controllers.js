const { fetchArticleById } = require('../models/articles-models')
const { fetchArticles } = require('../models/articles-models')

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

module.exports = { getArticleById, getArticles }