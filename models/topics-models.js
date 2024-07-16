const db = require('../db/connection')

const fetchTopics = () => {
    return db.query('SELECT * FROM topics')
        .then((response) => {
            return response.rows
        })
}

module.exports = { fetchTopics }