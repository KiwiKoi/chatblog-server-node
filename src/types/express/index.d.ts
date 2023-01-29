import express from 'express'

declare global {
    namespace Express {
        interface Request {
        prisma: any,
        userId?: Record<string, any>
        }
    }
}

