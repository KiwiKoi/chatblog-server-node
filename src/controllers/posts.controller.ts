import { Prisma, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export function getPosts() {
  return async (req: Request, res: Response) => {
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
      orderBy: { createdAt: orderBy as Prisma.SortOrder, updatedAt: orderBy as Prisma.SortOrder },
      include: { author: true },
    });
    res.json(posts);
  };
}

export function getPostById() {
  return async (req: Request, res: Response) => {
    const { id }: { id?: string } = req.params;
    const post = await prisma.post.findUnique({
      where: { id: String(id) },
      include: { author: true },
    });
    res.json(post);
  };
}

export function createPost() {
  return async (req: Request, res: Response) => {
    const postData = req.body;
    const authorId = req.query.user_id;

    console.log(req.params);
    const post = await prisma.post.create({
      data: {
        ...postData,
        author: {
          connect: { id: authorId },
        },
      },
    });
    res.json(post);
  };
}

export function deletePost() {
  return async (req: Request, res: Response) => {
    const { id } = req.params;
    const post = await prisma.post.delete({
      where: {
        id: String(id),
      },
    });
    res.json(post);
  };
}

export function updatePost() {
  return async (req: Request, res: Response) => {
    const id = req.params.id;
    const postData = req.body;
    const post = await prisma.post.update({
      where: { id: String(id) },
      data: postData,
    });

    res.json(post);
  };
}
