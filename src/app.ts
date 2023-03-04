import express, { Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { Message, PrismaClient } from '@prisma/client';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { createPost, deletePost, getPostById, getPosts, updatePost } from './controllers/posts.controller';
import { createComment, deleteComment, getCommentById, getComments } from './controllers/comments.controller';
import { createUser, deleteUser, getUserById, getUsers, updateUser } from './controllers/users.controller';
// import { setupSocketIo } from './sockets';

const session = require('express-session');
const cors = require('cors');

const port = 4000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});
const prisma = new PrismaClient();

const messages: Message[] = [];

function setupSocketIo() {
  io.on('connection', (socket) => {
    socket.on('getMsg', (msgId) => {
      socket.emit('message', messages[msgId]);
    });
    socket.on('addMsg', async (message) => {
      const newMessage = await prisma.message.create({ data: message });
      socket.emit('newMessage', newMessage);
      console.log('newMessage', newMessage);
    });
    socket.on('editMsg', (message) => {
      messages[message.id] = message;
      socket.to(message.id).emit('message', message);
    });
    socket.on('fetchMsgs', async () => {
      const allMessages = await prisma.message.findMany();
      socket.emit('messages', allMessages);
    });
    io.emit('messages', messages);
    console.log(`Socket connected [id=${socket.id}]`);
  });
}
setupSocketIo();
async function main() {
  // ... you will write your Prisma Client queries here
}

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
    res.status(403).send('Unauthorized!');
    return;
  }
}

app.use('/', checkAuth);

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    key: 'userID',
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { expires: 60 * 60 * 24 },
  })
);
app.set('port', process.env.PORT || port);

app.get(`/posts`, getPosts());
app.get(`/posts/:id`, getPostById());
app.post(`/posts`, createPost());
app.delete(`/posts/:id`, deletePost());
app.put(`/posts/:id`, updatePost());

app.get('/users', getUsers());
app.get(`/users/:id`, getUserById());
app.post(`/users`, createUser());
app.put(`/users/:id`, updateUser());
app.delete(`/users/:id`, deleteUser());

app.get('/comments', getComments());
app.get('/comments/:id', getCommentById());
app.post(`/comments`, createComment());
app.delete(`/comments/:id`, deleteComment());

server.listen(port, function () {
  console.log(`Server is running port ${port}`);
});
