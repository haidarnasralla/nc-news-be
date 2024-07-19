const express = require('express')
const app = express()
const { getTopics } = require('./controllers/topics-controllers')
const { getApi } = require('./controllers/api-controllers')
const { getArticleById, getArticles, getArticleComments, postArticleComments } = require('./controllers/articles-controllers')

app.get('/api/topics', getTopics)

app.get('/api', getApi)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id/comments', getArticleComments)

app.use(express.json())

app.post('/api/articles/:article_id/comments', postArticleComments)

app.use((err, req, res, next) => {
    if (err.code === "22P02") {
      res.status(400).send({ msg: 'bad request >:(' })
    }
    else if (err.code === '23503') {
      res.status(404).send({ msg: 'not found :(' })
    }
    else if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg })
    }
    else {
      res.status(500).send({ msg: 'internal server error :o' })} 
  })

module.exports = app