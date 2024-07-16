const { fetchTopics } = require('../models/topics-models')

const getTopics = (request, response, next) => {
    fetchTopics().then((topics) => {
        response.status(200).send({ topics })
    })
}

module.exports = { getTopics }