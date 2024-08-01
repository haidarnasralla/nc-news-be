const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics").then((response) => {
    return response.rows;
  });
};

exports.fetchArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then((res) => {
      if (res.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found :(" });
      }
      return res.rows[0];
    });
};

exports.fetchArticles = (topic, sort_by = "created_at", order = "desc") => {
  const validSortByColumns = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "comment_count",
  ];

  const validOrders = ["asc", "desc"];

  const validTopic = /^[a-zA-Z]+$/

  if (!validOrders.includes(order) || !validSortByColumns.includes(sort_by) || !validTopic.test(topic)) {
    return Promise.reject({ status: 400, msg: "bad request >:(" });
  }

  return db.query('SELECT slug FROM topics')
    .then((result) => {
      const validTopics = result.rows.map(row => row.slug);
      if (topic && !validTopics.includes(topic)) {
        return Promise.reject({ status: 404, msg: "not found :(" });
      }

      let sqlString = `
        SELECT
            articles.author, 
            articles.title,
            articles.article_id,
            articles.topic,
            articles.created_at,
            articles.votes,
            articles.article_img_url,
            COUNT(comments.comment_id) AS comment_count
        FROM
            articles
        LEFT JOIN
            comments ON articles.article_id = comments.article_id
      `;
      
      const queryAllTopics = [];

      if (topic) {
        sqlString += `WHERE topic = $1 `;
        queryAllTopics.push(topic);
      }

      sqlString += `GROUP BY articles.article_id ORDER BY articles.${sort_by} ${order}`;

      return db.query(sqlString, queryAllTopics).then((result) => {
        result.rows.forEach((article) => {
          article.comment_count = Number(article.comment_count);
        });
        return result.rows;
      });
    });
};

exports.fetchCommentByArticleId = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id=$1 ORDER BY created_at DESC`,
      [article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found :(" });
      }
      return result.rows;
    });
};

exports.insertCommentByArticleId = (article_id, author, body) => {
  if (author === undefined || body === undefined) {
    return Promise.reject({ status: 400, msg: "bad request >:(" });
  }
  return db
    .query(
      `INSERT INTO comments (author, body, article_id) VALUES ($1,$2,$3) RETURNING *;`,
      [author, body, article_id]
    )
    .then(({ rows }) => rows[0]);
};

exports.patchArticleVotes = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles SET votes = votes+ $1 WHERE article_id = $2 RETURNING *`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: `not found :(` });
      }
      return rows[0];
    });
};

exports.deleteComment = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *;", [
      comment_id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "not found :(",
        });
      }
      return rows[0];
    });
};

exports.fetchUsers = () => {
  return db.query("SELECT * FROM users").then((res) => {
    return res.rows;
  });
};
