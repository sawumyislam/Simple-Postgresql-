const express = require("express");
const app = express();
const { Pool } = require("pg");
require("dotenv").config();

// Middleware library
const morgan = require("morgan");

const PORT = process.env.PORT;
let pool = new Pool({
  host: "localhost",
  database: "practice",
  password: "161-35-1594",
  port: 5432,
});

// middleware // a function help to get req, res between server / client
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// request, respose,
app.get("/", (req, res, next) => {
  res.send(`<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
  </head>
  <body>
      <form action="/postgresql-practice/get" method="get">
          <input type="submit" value="get">          
      </form>
    <form action="/postgresql-practice/add" method="post">
        <label for="add">ADD:</label>
        <input type="text" name="add" id="add">
        <input type="submit" value="ADD">
    </form>
    <form action="/postgresql-practice/delete" method="post">
      <label for="delete">DELETE:</label>
      <input type="text" name="delete" id="delete">
      <input type="submit" value="DELETE">
    </form>
    <form action="/postgresql-practice/update" method="post">
      <label for="oldValue">Old Value:</label>
      <input type="text" name="oldValue" id="oldValue">
      <label for="newValue">New Value:</label>
      <input type="text" name="newValue" id="newValue">
      <input type="submit" value="UPDATE">
    </form>
  </body>
  </html>`);
});

// GET function
app.get("/postgresql-practice/get", (req, res) => {
  try {
    pool.connect(async (error, client, release) => {
      let reps = await client.query(`SELECT * FROM test`);
      res.send(reps.rows);
    });
  } catch (error) {
    console.log(error);
  }
});

// POST function
app.post("/postgresql-practice/add", (req, res) => {
  try {
    pool.connect(async (error, client, release) => {
      let reps = await client.query(
        `INSERT INTO test (name) VALUES ('${req.body.add}')`
      );
      res.redirect("/postgresql-practice/get");
    });
  } catch (error) {
    console.log(error);
  }
});

// PUT function
app.post("/postgresql-practice/update", (req, res) => {
  try {
    pool.connect(async (error, client, release) => {
      let reps = await client.query(
        `update test set name='${req.body.newValue}' where name='${req.body.oldValue}'`
      );
      res.redirect("/postgresql-practice/get");
    });
  } catch (error) {
    console.log(error);
  }
});

// DELETE function
app.post("/postgresql-practice/delete", (req, res) => {
  try {
    pool.connect(async (error, client, release) => {
      let reps = await client.query(
        `delete from test where name='${req.body.delete}'`
      );
      res.redirect("/postgresql-practice/get");
    });
  } catch (error) {
    console.log(error);
  }
});

// port configuration
app.listen(PORT, () => {
  console.log(`App started at port: ${PORT}`);
});
