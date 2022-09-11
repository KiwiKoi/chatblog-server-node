const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const db = require("./queries");
const port = 4000;

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    key: "userID",
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { expires: 60 * 60 * 24 },
  })
);

app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express, Postgres API" });
});
app.get("/login", (request, response) => {
  if(request.session.user){
    response.send({loggedIn: true, user: request.session.user});
  } else {
    response.send({loggedIn: false})
  }
})
app.set("port", process.env.PORT || port);
app.get("/posts", db.getPosts);
app.get("/posts/:id", db.getPostById);
app.post("/posts", db.createPost);
app.delete("/posts/:id", db.deletePost);

app.get("/users", db.getUsers);
app.get("/users/:id", db.getUserById);
app.post("/users", db.createUser);
app.delete("/users/:id", db.deleteUser);

app.get("/comments", db.getComments);
app.get("/comments/:id", db.getCommentById);
app.post("/comments", db.createComment);
app.delete("/comments/:id", db.deleteComment);

app.post("/login", db.login);

app.listen(4000, function () {
  console.log(`Server is running port ${port}`);
});
