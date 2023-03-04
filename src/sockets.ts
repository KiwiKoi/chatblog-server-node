import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { Message, PrismaClient } from '@prisma/client';

const app = express();

const server = http.createServer(app);
const prisma = new PrismaClient();

const messages: Message[] = [];

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});
export function setupSocketIo() {
  io.on('connection', (socket) => {
    socket.on('getMsg', (msgId) => {
      socket.emit('message', messages[msgId]);
    });
    socket.on('addMsg', async (message) => {
      const newMessage = await prisma.message.create({ data: message });
      socket.emit('newMessage', newMessage);
      console.log('newMessage', newMessage)
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
