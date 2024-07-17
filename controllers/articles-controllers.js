const { fetchArticles } = require('../models/articles-models')

const getArticles = (request, response, next) => {
    fetchArticles().then((articles) => {
        response.status(200).send({ articles })
    })
}

module.exports = { getArticles }