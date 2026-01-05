// @ts-ignore
import { PrismaClient } from '@prisma/client';

export class Model {
    // @ts-ignore
    protected static prisma = typeof PrismaClient !== 'undefined' ? new PrismaClient() : null;

    static async all() {
        return [];
    }

    static async find(id: any) {
        return null;
    }

    static async create(data: any) {
        return null;
    }

    static async update(id: any, data: any) {
        return null;
    }

    static async delete(id: any) {
        return null;
    }
}
