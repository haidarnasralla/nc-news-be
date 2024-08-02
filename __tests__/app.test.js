const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const endpoints = require("../endpoints.json");
const { toBeSortedBy } = require("jest-sorted");

beforeEach(() => seed(testData));
afterAll(() => db.end());

// GET /api/topics

describe("CORE: GET /api/topics", () => {
  it("200: Responds with array of objects containing 2 keys (slug & description) with string values", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

// GET /api

describe("CORE: GET /api", () => {
  it("200: Responds with contents of endpoints.json", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(endpoints);
      });
  });
});

// GET /api/articles/:article_id

describe("CORE: GET /api/articles/:article_id", () => {
  it("200: Responds with correct article when given valid article ID", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(article).toEqual({
          article_id: 1,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number) // Added for Ticket 13
        });
      });
  });

  it("404: Responds with not found for non-existent article_id", () => {
    return request(app)
      .get("/api/articles/99999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found :(");
      });
  });
  it("400: Responds with bad request for invalid article_id", () => {
    return request(app)
      .get("/api/articles/SPAMSPAMSPAM")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request >:(");
      });
  });
});

// GET /api/articles

describe("CORE: GET /api/articles", () => {
  it("200: Responds with an array of article objects with the following properties: author, title, article_id, topic, created_at, votes, article_img_url, comment_count.", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        articles.forEach((article) => {
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");
        });
      });
  });

  it("200: Articles are sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });

  it("200: No body property present on any of the article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        articles.forEach((article) => {
          expect(article).not.toHaveProperty("body");
        });
      });
  });
});

// GET /api/articles:article_id/comments

describe("CORE: GET /api/articles/:article_id/comments", () => {
  it("200: Returns array of comments for an article with valid id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
      });
  });
  it("200: Returns array ordered by most recent", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  it("404: Valid article_id, nonexistent article", () => {
    return request(app)
      .get("/api/articles/99/comments")
      .then(({ body }) => {
        const msg = body.msg;
        expect(msg).toBe("not found :(");
      });
  });
  it("400: Invalid article_id", () => {
    return request(app)
      .get("/api/articles/twenty/comments")
      .expect(400)
      .then(({ body }) => {
        const msg = body.msg;
        expect(msg).toBe("bad request >:(");
      });
  });
});

// POST /api/articles/:article_id/comment

describe("CORE: POST /api/articles/:article_id/comments", () => {
  it("201: Responds with posted comment", () => {
    const newComment = {
      author: "rogersop",
      body: "SPAM SPAM SPAM SPAM SPAM SPAM SPAM",
    };
    return request(app)
      .post("/api/articles/9/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        const expectedComment = {
          article_id: expect.any(Number),
          author: "rogersop",
          body: "SPAM SPAM SPAM SPAM SPAM SPAM SPAM",
          comment_id: expect.any(Number),
          created_at: expect.any(String),
          votes: expect.any(Number),
        };
        expect(comment).toMatchObject(expectedComment);
      });
  });
  it("404: Responds with not found for non-existent article_id", () => {
    const newComment = {
      author: "rogersop",
      body: "SPAM SPAM SPAM SPAM SPAM SPAM SPAM",
    };
    return request(app)
      .post("/api/articles/99999/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found :(");
      });
  });
  it("404: Responds with an error message when username does not exist", () => {
    const newComment = {
      author: "tarzan",
      body: "SPAM SPAM SPAM SPAM SPAM SPAM SPAM",
    };
    return request(app)
      .post("/api/articles/9/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found :(");
      });
  });
  it("400: Responds with an error message when required fields incomplete", () => {
    const newComment = { author: "rogersop" };
    return request(app)
      .post("/api/articles/9/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request >:(");
      });
  });
  it("400: Responds with an error when id is a valid type but an invalid value", () => {
    const newComment = {
      author: "rogersop",
      body: "SPAM SPAM SPAM SPAM SPAM SPAM SPAM",
    };
    return request(app)
      .post("/api/articles/pantaloons/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request >:(");
      });
  });
});

// PATCH /api/articles/:article_id

describe("CORE: PATCH /api/articles/:article_id", () => {
  it("200: Responds with updated article by article_id", () => {
    const vote = { inc_votes: 100 };
    return request(app)
      .patch("/api/articles/1")
      .send(vote)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 1,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: 200,
          article_img_url: expect.any(String),
        });
      });
  });
  it("400: Invalid article id", () => {
    const vote = { inc_votes: 100 };
    return request(app)
      .patch("/api/articles/spamwithchips")
      .send(vote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request >:(");
      });
  });
  it("404: Valid article_id, nonexistent article'", () => {
    const vote = { inc_votes: 100 };
    return request(app)
      .patch("/api/articles/99999")
      .send(vote)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found :(");
      });
  });
  it("400: Invalid data - inc_votes property not a number", () => {
    const vote = { inc_votes: "spam with spam" };
    return request(app)
      .patch("/api/articles/1")
      .send(vote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request >:(");
      });
  });
});

describe("CORE: DELETE /api/comments/:comment_id", () => {
  it("204: Comment deleted", () => {
    return request(app).delete("/api/comments/5").expect(204);
  });
  it("404: Non existent ID", () => {
    return request(app)
      .delete("/api/comments/9999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found :(");
      });
  });
  it("400: Invalid ID", () => {
    return request(app)
      .delete("/api/comments/spamkebab")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request >:(");
      });
  });
});

describe("CORE: GET /api/users", () => {
  it("200: Responds with array of objects with username, name and avatur_url properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users.length).toBe(4)
        users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});

describe("CORE: SORTING/ORDER FEATURE - GET /api/articles", () => {
  it("200: Responds with articles ordered by created_at by default", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(13);
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  it("200: Responds with array of articles sorted by any valid column & order", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(13);
        expect(body.articles).toBeSortedBy("title", { descending: false });
      });
  });
  it("400: Responds with error when sort_by invalid column", () => {
    return request(app)
      .get("/api/articles?sort_by=invalid_input_column")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request >:(");
      });
  });
  it("400: Invalid order", () => {
    return request(app)
      .get("/api/articles?order=invalid_order")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request >:(");
      });
  });
 })

 // CORE: TOPIC QUERY - GET /api/articles

describe('CORE: TOPIC QUERY - GET /api/articles', () => {
  it("200: Responds with an array of articles filtered by topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(12);
        body.articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  it("400: Responds with error when topic invalid", () => {
    return request(app)
      .get("/api/articles?topic=9999")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request >:(");
      });
  });
  it("404: Valid, but non existent topic", () => {
    return request(app)
      .get("/api/articles?topic=dogs")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found :(");
      });
  });
})