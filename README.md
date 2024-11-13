# NC News Backend API

[Hosted Version](https://nc-news-be-v00f.onrender.com/api)

Welcome to the **NC News Backend API**, the RESTful API that powers the [NC News platform](https://github.com/haidarnasralla/nc-news-fe). This backend allows users to fetch articles, post comments, and manage votes. The project is built with **Express**, **Node.js**, and **PostgreSQL**.

---

## Table of Contents

1. [About the Project](#about-the-project)
2. [Minimum Requirements](#minimum-requirements)
3. [Installation and Setup](#installation-and-setup)
4. [Testing](#testing)

---

## About the Project

The backend API for NC News is a fully functional, RESTful API. It demonstrates database-driven operations, CRUD functionality, and error handling. The project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/).

---

## Minimum Requirements

To run this project, ensure the following are installed:
- **Node.js**: v18.19.1 or higher
- **PostgreSQL**: v16.3 or higher

---

## Installation and Setup

Follow these steps to set up and run the project locally:

### 1. Clone the Repository
- Open your terminal and run:
  ```bash
  git clone https://github.com/haidarnasralla/nc-news-be
  ```
- Navigate into the project directory:
  ```bash
  cd nc-news-be
  ```

### 2. Install Dependencies
- Run the following command to install all required dependencies:
  ```bash
  npm install
  ```

### 3. Environment Variables
- Ensure that `.gitignore` includes `.env.*` files to keep environment variables secure.
- Create two environment files in the root directory:
  - `.env.development` with the following content:
    ```
    PGDATABASE=nc_news
    ```
  - `.env.test` with the following content:
    ```
    PGDATABASE=nc_news_test
    ```

### 4. Set Up the Database
- Run the following command to set up the databases:
  ```bash
  npm run setup-dbs
  ```

### 5. Seed the Development Database
- Populate the development database with seed data:
  ```bash
  npm run seed
  ```

### 6. Start the Server
- Start the server locally:
  ```bash
  npm start
  ```
- The API will now be accessible at:
  ```
  http://localhost:9090
  ```

---

## Testing

This project includes a full test suite. To run the tests, execute:
```bash
npm test
```
