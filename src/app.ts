const express = require("express");

export const jwt = require("jsonwebtoken");
import { Prisma, PrismaClient } from "@prisma/client";

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const cors = require("cors");
const db = require("./queries");
const port = 4000;

const app = express();
const prisma = new PrismaClient();

async function main() {
  // ... you will write your Prisma Client queries here
  // await prisma.user.create({
  //   data: {
  //     username: "kiwi2",
  //     firstname: "Daniel",
  //     lastname: "Visage",
  //     email: "test2@email.com",
  //     password: "test",
  //     posts: { 
  //       create: [
  //         {title: 'new post', content: 'new content'}
  //       ]
  //     }
  //   },
  // });
  const allUsers = await prisma.user.findMany();
  console.log(allUsers);
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

const verifyJWT = (req: any, res: any, next: any) => {
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

app.get("/", (request: any, response: any) => {
  response.json({ info: "Node.js, Express, Postgres API" });
});

app.get("/login", (request: any, response: any) => {
  if (request.session.user) {
    response.send({ loggedIn: true, user: request.session.user });
  } else {
    response.send({ loggedIn: false });
  }
});

app.get(`/posts`, async (req: any, res: any) => {
  const { searchString, skip, take, orderBy } = req.query;

  const or: Prisma.PostWhereInput = searchString
    ? {
        OR: [
          { title: { contains: searchString as string } },
          { content: { contains: searchString as string } },
        ],
      }
    : {};

  const posts = await prisma.post.findMany({
    orderBy: { updatedAt: orderBy as Prisma.SortOrder },
  });

  res.json(posts);
});

app.get(`/posts/:id`, async (req: any, res: any) => {
  const { id }: { id?: string } = req.params;
  const post = await prisma.post.findUnique({
    where: { id: String(id) },
  });
  res.json(post);
});

app.post(`/posts`, async (req: any, res: any) => {
  const { title, content, image, author } = req.body;
  const result = await prisma.post.create({
    data: { title, content, image, author },
  });
  res.json(result);
});

app.delete(`/posts/:id`, async (req: any, res: any) => {
  const { id } = req.params;
  const post = await prisma.post.delete({
    where: {
      id: String(id),
    },
  });
  res.json(post);
});
app.get("/users", async (req: any, res: any) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.get(`/users/:id`, async (req: any, res: any) => {
  const { id }: { id?: string } = req.params;
  const user = await prisma.user.findUnique({
    where: { id: String(id) },
  });
  res.json(user);
});

app.post(`/users`, async (req: any, res: any) => {
  const { username, firstname, lastname, email, password } = req.body;
  const result = await prisma.user.create({
    data: { username, firstname, lastname, email, password },
  });
  res.json(result);
});
app.delete(`/users/:id`, async (req: any, res: any) => {
  const { id } = req.params;
  const user = await prisma.user.delete({
    where: {
      id: String(id),
    },
  });
  res.json(user);
});
app.get("/comments", async (req: any, res: any) => {
  const comments = await prisma.comment.findMany();
  res.json(comments);
});
app.get(`/comments/:id`, async (req: any, res: any) => {
  const { id }: { id?: string } = req.params;
  const comment = await prisma.comment.findUnique({
    where: { id: String(id) },
  });
  res.json(comment);
});

app.post(`/comments`, async (req: any, res: any) => {
  const { content, createdAt, updatedAt } = req.body;
  const result = await prisma.comment.create({
    data: { content, createdAt, updatedAt },
  });
  res.json(result);
});
app.delete(`/comments/:id`, async (req: any, res: any) => {
  const { id } = req.params;
  const comment = await prisma.comment.delete({
    where: {
      id: String(id),
    },
  });
  res.json(comment);
});

// app.post("/login", db.login);

app.listen(4000, function () {
  console.log(`Server is running port ${port}`);
});
