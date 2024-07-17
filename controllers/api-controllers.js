const endpoints = require('../endpoints.json')

const getApi = (request, response) => { // no next because no error handling
    response.status(200).send({ endpoints: endpoints }) // sending an object with a key of "endpoints" with a value of the endpoints file
}

module.exports = { getApi }