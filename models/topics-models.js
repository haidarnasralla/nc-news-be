const db = require('../db/connection')

exports.fetchTopics = () => {
    return db.query('SELECT * FROM topics')
        .then((response) => {
            return response.rows
        })
}