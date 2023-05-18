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

const users = [];
const threadList = [];

const generateID = () => Math.random().toString(36).substring(2, 10);

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

      if (await bcrypt.compare(password, hashedPassword)) {
        return res.json({
          message: `Welcome, ${user}!`,
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
  const { thread, userId } = req.body;
  const threadId = generateID();

  threadList.unshift({
    id: threadId,
    title: thread,
    userId,
    replies: [],
    likes: [],
  });

  res.json({
    message: "Thread created successfully!",
    threads: threadList,
  });
});

app.post("/api/thread/like", (req, res) => {
  const { threadId, userId } = req.body;
  const result = threadList.filter((thread) => thread.id === threadId);
  const threadLikes = result[0].likes;
  const authenticateReaction = threadLikes.filter((user) => user === userId);
  if (authenticateReaction.length === 0) {
    threadLikes.push(userId);
    return res.json({
      message: "You've reacted to the post!",
    });
  }
  res.json({
    error_message: "You can only react once!",
  });
});

app.post("/api/thread/replies", (req, res) => {
  const { id } = req.body;
  const result = threadList.filter((thread) => thread.id === id);
  res.json({
    replies: result[0].replies,
    title: result[0].title,
  });
});

app.post("/api/create/reply", async (req, res) => {
  const { id, userId, reply } = req.body;
  const result = threadList.filter((thread) => thread.id === id);
  const user = users.filter((user) => user.id === userId);
  result[0].replies.unshift({
    userId: user[0].id,
    name: user[0].username,
    text: reply,
  });

  res.json({
    message: "Response added successfully!",
  });
});

app.get("/api", (req, res) => {
  res.json({
    message: "From server",
  });
});

app.get("/api/all/threads", (req, res) => {
  res.json({
    threads: threadList,
  });
});

app.get("/", function (req, res, next) {
  res.send("Connected");
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
