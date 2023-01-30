// const express = require("express");
import express, { Request, Response } from "express";

export const jwt = require("jsonwebtoken");
import { Prisma, PrismaClient } from "@prisma/client";

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const cors = require("cors");
const port = 4000;

const app = express();
const prisma = new PrismaClient();

async function main() {
  // ... you will write your Prisma Client queries here
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

let authorized = true;

function checkAuth(req: Request, res: Response, next: any) {
  if (authorized) {
    next();
  } else {
    res.status(403).send("Unauthorized!");
    return;
  }
}

app.use("/", checkAuth);

app.use(
  cors()
  //   {
  //   origin: ["http://localhost:3000"],
  //   methods: ["GET", "POST"],
  //   credentials: true,
  // }
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
app.set("port", process.env.PORT || port);

const verifyJWT = (req: Request, res: Response, next: any) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    res.send("Token needed.");
  } else {
    jwt.verify(token, "jwtSecret", (err: any, decoded: any) => {
      if (err) {
        res.json({ auth: false, message: "auth failed" });
      } else {
        req.userId = decoded.id;
        next();
      }
    });
  }
};

app.get("/isUserAuthenticated", verifyJWT, (response: any, request: any) => {
  response.send("You are authenticated.");
});

app.get("/login", (request: any, response: Response) => {
  if (request.session.user) {
    response.send({ loggedIn: true, user: request.session.user });
  } else {
    response.send({ loggedIn: false });
  }
});

app.get(`/posts`, async (req: Request, res: Response) => {
  const { searchString, skip, take, orderBy } = req.query;

  const or: Prisma.PostWhereInput = searchString
    ? {
        OR: [
          { title: { contains: searchString as string } },
          { body: { contains: searchString as string } },
        ],
      }
    : {};

  const posts = await prisma.post.findMany({
    orderBy: { updatedAt: orderBy as Prisma.SortOrder },
    include: { author: true },
  });

  res.json(posts);
});

app.get(`/posts/:id`, async (req: Request, res: Response) => {
  const { id }: { id?: string } = req.params;
  const post = await prisma.post.findUnique({
    where: { id: String(id) },
    include: { author: true },
  });
  res.json(post);
});

app.post(`/posts`, async (req: Request, res: Response) => {
  const postData = req.body;
  const userID = req.query.userID;
  console.log(req.body);
  const post = await prisma.post.create({
    data: {
      ...postData,
      author: {
        connect: { id: userID },
      },
    },
  });
  res.json(post);
});

app.delete(`/posts/:id`, async (req: Request, res: Response) => {
  const { id } = req.params;
  const post = await prisma.post.delete({
    where: {
      id: String(id),
    },
  });
  res.json(post);
});

app.put(`/posts/:id`, async (req: Request, res: Response) => {
  const id = req.params.id;
  const postData = req.body;
  const post = await prisma.post.update({
    where: { id: String(id) },
    data: postData,
  });

  res.json(post);
});

app.get("/users", async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
});
app.get(`/users/:id`, async (req: Request, res: Response) => {
  const { id }: { id?: string } = req.params;
  const user = await prisma.user.findUnique({
    where: { id: String(id) },
  });
  res.json(user);
});
app.post(`/users`, async (req: Request, res: Response) => {
  const userData = req.body;
  const user = await prisma.user.create({
    data: {
      id: userData.uid,
      email: userData.email,
    },
  });

  res.json(user);
});
app.put(`/users/:id`, async (req: Request, res: Response) => {
  const id = req.params.id;
  const userData = req.body;
  const user = await prisma.user.update({
    where: { id: String(id) },
    data: userData,
  });

  res.json(user);
});
app.delete(`/users/:id`, async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await prisma.user.delete({
    where: {
      id: String(id),
    },
  });
  res.json(user);
});
app.get("/comments", async (req: Request, res: Response) => {
  const { orderBy, postID } = req.query;
  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: orderBy as Prisma.SortOrder },
    where: { postID: String(postID) },
    include: { author: true },
  });
  res.json(comments);
});
app.get(`/comments/:id`, async (req: Request, res: Response) => {
  const { id }: { id?: string } = req.params;
  const comment = await prisma.comment.findUnique({
    where: { id: String(id) },
    include: { author: true },
  });
  res.json(comment);
});

app.post(`/comments`, async (req: Request, res: Response) => {
  const { body, createdAt, userID, postID } = req.body;
  const result = await prisma.comment.create({
    data: { body, createdAt, userID, postID },
  });
  res.json(result);
});

app.delete(`/comments/:id`, async (req: Request, res: Response) => {
  const { id } = req.params;
  const comment = await prisma.comment.delete({
    where: {
      id: String(id),
    },
  });
  res.json(comment);
});

app.listen(port, function () {
  console.log(`Server is running port ${port}`);
});
