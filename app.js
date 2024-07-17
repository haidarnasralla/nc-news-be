const express = require('express')
const app = express()
const { getTopics } = require('./controllers/topics-controllers')
const { getApi } = require('./controllers/api-controllers')
const { getArticles } = require('./controllers/articles-controllers')

app.get('/api/topics', getTopics)

app.get('/api', getApi)

app.get('/api/articles/:article_id', getArticles)

module.exports = app