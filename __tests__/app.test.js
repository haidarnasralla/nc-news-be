const request = require('supertest')
const app = require('../app.js')
const db = require('../db/connection')
const testData = require('../db/data/test-data')
const seed = require('../db/seeds/seed')
const endpoints = require('../endpoints.json')
const { toBeSortedBy } = require('jest-sorted')

beforeEach(() => seed(testData));
afterAll(() => db.end())

describe('GET /api/topics', () => {
    it('200: Responds with array of objects containing 2 keys (slug & description) with string values', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
          const { topics } = body
          topics.forEach((topic) => {
            expect(typeof topic.slug).toBe('string')
            expect(typeof topic.description).toBe('string')
          })
          })
        })
    })

describe('GET /api', () => {
    it('200: Responds with contents of endpoints.json', () => {
      return request(app)
        .get('/api')
        .expect(200)
        .then(({ body }) => {
          expect(body.endpoints).toEqual(endpoints)
        })
      })
  })

describe('GET /api/articles/:article_id', () => {
  it('200: Responds with correct article when given valid article ID', () => {
    return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then(({ body }) => {
        const article = body.article
        expect(article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z", // Original was a UNIX timestamp!
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",      
        })
      })
    })
  it('404: Responds with not found for non-existent article_id', () => {
   return request(app)
    .get('/api/articles/99999')
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe('not found :(')
    })
  })
  it('400: Responds with bad request for invalid article_id', () => {
    return request(app)
     .get('/api/articles/SPAMSPAMSPAM')
     .expect(400)
     .then(({ body }) => {
       expect(body.msg).toBe('bad request >:(')
     })
  }) 
})

describe('GET /api/articles', () => {
  it('200: Responds with an array of article objects with the following properties: author, title, article_id, topic, created_at, votes, article_img_url, comment_count.', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        articles.forEach((article) => {
          expect(article).toHaveProperty('author')
          expect(article).toHaveProperty('title')
          expect(article).toHaveProperty('article_id')
          expect(article).toHaveProperty('topic')
          expect(article).toHaveProperty('created_at')
          expect(article).toHaveProperty('votes')
          expect(article).toHaveProperty('article_img_url')
          expect(article).toHaveProperty('comment_count')
        })
      })
  })

  it('200: Articles are sorted by date in descending order', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles
        expect(articles).toBeSortedBy('created_at', { descending: true })
      });
  });

  it('200: No body property present on any of the article objects', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        articles.forEach((article) => {
          expect(article).not.toHaveProperty('body')
        })
      })
  })
})

describe('GET /api/articles/:article_id/comments', () => {
  it('200: Returns array of comments for an article with valid id', () => {
      return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then((response) => {
          const comments = response.body.comments;
          comments.forEach((comment) => {
              expect(comment).toMatchObject({
                  comment_id: expect.any(Number),
                  votes: expect.any(Number),
                  created_at: expect.any(String),
                  author: expect.any(String),
                  body: expect.any(String),
                  article_id: expect.any(Number)
              })
          })
      })
  })
  it('200: Returns array ordered by most recent', () => {
      return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then((response) => {
          const comments = response.body.comments;
          expect(comments).toBeSortedBy('created_at', {descending: true})
      })
  })
  it('400 - Invalid article_id', () => {
      return request(app)
      .get('/api/articles/twenty/comments')
      .expect(400)
      .then((response) => {
          const msg = response.body.msg
          expect(msg).toBe('bad request >:(')
      })
  })
  it('404 - Valid article_id, nonexistent article', () => {
      return request(app)
      .get('/api/articles/99/comments')
      .then((response) => {
          const msg = response.body.msg;
          expect(msg).toBe('not found :(')
      })
  })
})