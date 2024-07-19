const db = require('../db/connection')

exports.fetchCommentById = (article_id, order = 'DESC', limit = 10, p = 1) => {
    return db
      .query('SELECT * FROM articles WHERE article_id = $1', [article_id])
      .then(({ rows }) => {
        if (!rows[0]) return Promise.reject({ status: 404, msg: 'not found :(' });
        const offset = (p - 1) * limit;
        const articleCommentsQueryString = `
        SELECT * FROM comments WHERE article_id = $1 
        ORDER BY created_at ${order}
        LIMIT $2 OFFSET $3;`  
        return db.query(articleCommentsQueryString, [article_id, limit, offset]);
      })
      .then(({ rows }) => {
        return rows;
      });
  }

exports.insertCommentById =  (article_id, author, body) => {

    if (author === undefined || body === undefined) {
        return Promise.reject({ status: 400, msg: 'bad request >:(' })
      }

    return db.query(`INSERT INTO comments (author, body, article_id) VALUES ($1,$2,$3) RETURNING *;`, [author, body, article_id])
    .then(({ rows }) =>  rows[0])
    }