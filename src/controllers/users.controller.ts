import { Prisma, PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

const app = express();
const prisma = new PrismaClient();

export function getUsers() {
  return async (req: Request, res: Response) => {
    const users = await prisma.user.findMany();
    res.json(users);
  };
}

export function getUserById() {
  return async (req: Request, res: Response) => {
    const { id }: { id?: string } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: String(id) },
      include: { posts: true },
    });
    res.json(user);
  };
}

export function getUserPosts() {
  return async (req: Request, res: Response) => {
    const { id }: { id?: string } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: String(id) },
    });
    res.json(user);
  };
}

export function createUser() {
  return async (req: Request, res: Response) => {
    const userData = req.body;
    const user = await prisma.user.create({
      data: {
        id: userData.uid,
        email: userData.email,
      },
    });

    res.json(user);
  };
}

export function updateUser() {
  return async (req: Request, res: Response) => {
    const id = req.params.id;
    const userData = req.body;
    const user = await prisma.user.update({
      where: { id: String(id) },
      data: userData,
    });

    res.json(user);
  };
}

export function deleteUser() {
  return async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await prisma.user.delete({
      where: {
        id: String(id),
      },
    });
    res.json(user);
  };
}
