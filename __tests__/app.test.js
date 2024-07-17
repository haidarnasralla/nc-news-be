const request = require('supertest')
const app = require('../app.js')
const db = require('../db/connection')
const testData = require('../db/data/test-data')
const seed = require('../db/seeds/seed')
const endpoints = require('../endpoints.json')

beforeEach(() => seed(testData));
afterAll(() => db.end())

describe('GET /api/topics', () => {
    it('200: /api/topics responds with array of objects containing 2 keys (slug & description) with string values', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
          const { topics } = body
          // I'm not entirely sure why I can't just iterate using body.forEach here?
          topics.forEach((topic) => {
            expect(typeof topic.slug).toBe('string')
            expect(typeof topic.description).toBe('string')
          })
          })
        })
    })

describe('GET /api', () => {
    it('200: /api responds with contents of endpoints.json', () => {
      return request(app)
        .get('/api')
        .expect(200)
        .then(({ body }) => {
          expect(body.endpoints).toEqual(endpoints)
        })
      })
  })

describe('GET /api/articles/:article_id', () => {
  it('200: /api/articles/:article_id responds with correct article when given valid article ID', () => {
    return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then((response) => {
        const article = response.body
        expect(article).toEqual({
          article_id: 1;
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: 1594329060000,
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",      
        })
      })
    })
})