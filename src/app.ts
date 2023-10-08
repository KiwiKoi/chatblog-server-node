import { PrismaClient } from "@prisma/client";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
import http from "http";
import {
  createComment,
  deleteComment,
  getCommentsByPostId,
} from "./controllers/comments.controller";
import {
  createPost,
  deletePost,
  getPostById,
  getPosts,
  updatePost,
} from "./controllers/posts.controller";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "./controllers/users.controller";

const session = require("express-session");
const cors = require("cors");

const port = 8080;

const app = express();
const server = http.createServer(app);
const prisma = new PrismaClient();
const io = require("socket.io")(server, {
  cors: { origin: "*" },
});

async function main() {}

async function run() {
  try {
    await main();
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}
run();

const authorized = true;

function checkAuth(req: Request, res: Response, next: any) {
  if (authorized) {
    next();
  } else {
    res.status(403).send("Unauthorized!");
    return;
  }
}

io.on("connection", (socket: any) => {
  console.log("a user connected");

  socket.on("message", (message: any) => {
    console.log(message);
    io.emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected!");
  });
});

app.use("/", checkAuth);

app.use(cors());
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
app.set("port", process.env.PORT || port);

app.get(`/posts`, getPosts());
app.get(`/posts/:id`, getPostById());
app.post(`/posts`, createPost());
app.delete(`/posts/:id`, deletePost());
app.put(`/posts/:id`, updatePost());

app.get("/users", getUsers());
app.get(`/users/:id`, getUserById());
app.post(`/users`, createUser());
app.put(`/users/:id`, updateUser());
app.delete(`/users/:id`, deleteUser());

app.get("/comments/:postID", getCommentsByPostId());
app.post(`/comments`, createComment());
app.delete(`/comments/:id`, deleteComment());

server.listen(port, function () {
  console.log(`Server is running port ${port}`);
});
