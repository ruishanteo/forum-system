const express = require("express");
const bcrypt = require("bcrypt");
const mysql = require("mysql");
const cors = require("cors");
const db = require("./db_connection.js");
const app = express();
const PORT = 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.post("/api/register", async (req, res) => {
  const user = req.body.username;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const sqlSearch = "SELECT * FROM users WHERE user = ?";
  const search_query = mysql.format(sqlSearch, [user]);
  const sqlInsert = "INSERT INTO users VALUES (0,?,?)";
  const insert_query = mysql.format(sqlInsert, [user, hashedPassword]);

  await db.connection.query(search_query, async (err, result) => {
    if (err) throw err;
    if (result.length != 0) {
      return res.json({
        error_message: "User already exists!",
      });
    } else {
      await db.connection.query(insert_query, (err, result) => {
        if (err) throw err;
        return res.json({
          message: "Account created successfully!",
        });
      });
    }
  });
});

app.post("/api/login", (req, res) => {
  const user = req.body.username;
  const password = req.body.password;

  const sqlSearch = "SELECT * FROM users WHERE user = ?";
  const search_query = mysql.format(sqlSearch, [user]);

  db.connection.query(search_query, async (err, result) => {
    if (err) throw err;
    if (result.length == 0) {
      return res.json({
        error_message: "User does not exist!",
      });
    } else {
      const hashedPassword = result[0].password;
      const id = result[0].userId;

      if (await bcrypt.compare(password, hashedPassword)) {
        return res.json({
          message: `Welcome, ${user}!`,
          id: id,
        });
      } else {
        return res.json({
          error_message: "Password incorrect!",
        });
      }
    }
  });
});

app.post("/api/create/thread", async (req, res) => {
  const author = req.body.userId;
  const title = req.body.title;
  const text = req.body.thread;

  const sqlInsert = "INSERT INTO threads VALUES (0, ?, ?, ?, 0, 0)";
  const insert_query = mysql.format(sqlInsert, [author, title, text]);

  await db.connection.query(insert_query, (err, result) => {
    if (err) throw err;
    return res.json({
      message: "Thread created successfully!",
    });
  });
});

app.post("/api/thread/like", async (req, res) => {
  const threadId = req.body.threadId;
  const userId = req.body.userId;

  const sqlSearch = "SELECT * FROM threads WHERE threadId = ?";
  const search_query = mysql.format(sqlSearch, [threadId]);

  await db.connection.query(search_query, async (err, result) => {
    if (err) throw err;
    if (result.length != 0) {
      const sqlUpdate = "UPDATE threads SET likesCount = ? WHERE threadId = ?";
      const update_query = mysql.format(sqlUpdate, [
        result[0].likesCount + 1,
        threadId,
      ]);
      await db.connection.query(update_query, async (err, result) => {
        if (err) {
          throw err;
        } else {
          return res.json({
            message: "Like successful!",
          });
        }
      });
    }
  });
});

app.post("/api/thread/replies", async (req, res) => {
  const threadId = req.body.id;

  const sqlSearch = "SELECT * FROM replies WHERE threadId = ?";
  const search_query = mysql.format(sqlSearch, [threadId]);

  await db.connection.query(search_query, async (err, repliesResult) => {
    if (err) throw err;
    const sqlSearchTitle = "SELECT * FROM threads WHERE threadId = ?";
    const search_title_query = mysql.format(sqlSearchTitle, [threadId]);

    await db.connection.query(search_title_query, async (err, threadResult) => {
      if (err) throw err;

      res.json({
        replies: repliesResult,
        title: threadResult[0].title,
      });
    });
  });
});

app.post("/api/create/reply", async (req, res) => {
  const threadId = req.body.id;
  const author = req.body.userId;
  const text = req.body.reply;

  const sqlSearchUser = "SELECT * FROM users WHERE userId = ?";
  const search_user_query = mysql.format(sqlSearchUser, [author]);

  await db.connection.query(search_user_query, async (err, userResult) => {
    if (err) throw err;
    if (userResult.length == 0) {
      res.json({
        error_message: "Invalid user!",
      });
    }
    const sqlInsert = "INSERT INTO replies VALUES (0, ?, ?, ?, ?)";
    const insert_query = mysql.format(sqlInsert, [
      threadId,
      author,
      userResult[0].user,
      text,
    ]);

    await db.connection.query(insert_query, (err, result) => {
      if (err) throw err;
      res.json({
        message: "Response added successfully!",
      });
    });

    const sqlSearch = "SELECT * FROM threads WHERE threadId = ?";
    const search_query = mysql.format(sqlSearch, [threadId]);

    await db.connection.query(search_query, async (err, result) => {
      if (err) throw err;
      if (result.length != 0) {
        const sqlUpdate =
          "UPDATE threads SET repliesCount = ? WHERE threadId = ?";
        const update_query = mysql.format(sqlUpdate, [
          result[0].repliesCount + 1,
          threadId,
        ]);
        await db.connection.query(update_query, async (err, result) => {
          if (err) {
            throw err;
          }
        });
      }
    });
  });
});

app.get("/api", (req, res) => {
  res.json({
    message: "From server",
  });
});

app.get("/api/all/threads", async (req, res) => {
  const sqlSearch = "SELECT * FROM threads";

  await db.connection.query(sqlSearch, async (err, result) => {
    if (err) throw err;
    res.json({
      threads: result,
    });
  });
});

app.get("/", function (req, res, next) {
  res.send("Connected");
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
