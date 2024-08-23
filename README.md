# NC News Backend API

Welcome to the backend of NC News - a social news platform based on Reddit which allows users to fetch, post and comment on articles as well as upvotes and downvotes.

It's a demonstration of a RESTful backend API, built using Express, Node.js and PostgreSQL. You can access the hosted version [here](https://nc-news-be-v00f.onrender.com) where you will receive a JSON of all the available endpoints.

### Minimum Requirements

* Node v18.19.1
* PostgreSQL 16.3

### Running project locally

* Clone the repository: `git clone https://github.com/haidarnasralla/nc-news-be`
* Make sure you are inside the correct directory (`../nc-news-be`) and run `npm install` to install dependencies.
* Ensure that `.gitignore` ignores `.env` files by checking that `.env.*` is listed.
* Create a file in the home directory: `.env.development`, add the line `PGDATABASE=nc_news`
* Create another file `.env.test`, add the line `PGDATABASE=nc_news_test`
* Set up the database: `npm run setup-dbs`
* Seed the development database:  `npm run seed`
* Run the tests suites: `npm test`
* Start the server locally: `npm start`

You will now be able to access the API [locally](http://localhost:9090)

--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
