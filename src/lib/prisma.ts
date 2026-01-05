// @ts-ignore
import { PrismaClient } from '@prisma/client';

declare global {
    var prisma: any;
}

// @ts-ignore
export const prisma = global.prisma || (typeof PrismaClient !== 'undefined' ? new PrismaClient() : null);

if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma;
}
