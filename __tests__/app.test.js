const request = require('supertest')
const app = require('../app.js')
const db = require('../db/connection') // can also be called index.js
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