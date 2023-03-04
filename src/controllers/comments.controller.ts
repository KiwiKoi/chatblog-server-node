import { Prisma, PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';

const app = express();
const prisma = new PrismaClient();

export function getComments() {
  return async (req: Request, res: Response) => {
    const { orderBy, postID } = req.query;
    const comments = await prisma.comment.findMany({
      orderBy: { createdAt: orderBy as Prisma.SortOrder },
      where: { postID: String(postID) },
      include: { author: true },
    });
    res.json(comments);
  };
}

export function getCommentById() {
  return async (req: Request, res: Response) => {
    const { id }: { id?: string } = req.params;
    const comment = await prisma.comment.findUnique({
      where: { id: String(id) },
      include: { author: true },
    });
    res.json(comment);
  };
}

export function createComment() {
  return async (req: Request, res: Response) => {
    const { body, createdAt, userID, postID } = req.body;
    const result = await prisma.comment.create({
      data: { body, createdAt, userID, postID },
    });
    res.json(result);
  };
}

export function deleteComment() {
  return async (req: Request, res: Response) => {
    const { id } = req.params;
    const comment = await prisma.comment.delete({
      where: {
        id: String(id),
      },
    });
    res.json(comment);
  };
}
