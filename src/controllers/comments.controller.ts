import {Prisma, PrismaClient} from "@prisma/client";
import {Request, Response} from "express";

const prisma = new PrismaClient();

export function getCommentsByPostId() {
    return async (req: Request, res: Response) => {
        console.log(req.params)
        const { postID} = req.params;
        const comments = await prisma.comment.findMany({
            orderBy: {created_at: 'desc' as Prisma.SortOrder},
            where: {postID: String(postID)},
            include: {author: true},
        });
        res.json(comments);
    };
}

export function getCommentById() {
    return async (req: Request, res: Response) => {
        const {id}: { id?: string } = req.params;
        const comment = await prisma.comment.findUnique({
            where: {id: String(id)},
            include: {author: true},
        });
        res.json(comment);
    };
}

export function createComment() {
    return async (req: Request, res: Response) => {
        const {body, created_at} = req.body;
        const user_id = String(req.query.userId);
        const postID = String(req.query.postId);
        const result = await prisma.comment.create({
            data: {body, created_at, user_id, postID},
        });
        res.json(result);
    };
}

export function deleteComment() {
    return async (req: Request, res: Response) => {
        const {id} = req.params;
        const comment = await prisma.comment.delete({
            where: {
                id: String(id),
            },
        });
        res.json(comment);
    };
}
