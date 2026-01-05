import { PrismaClient } from '@prisma/client';

export class Model {
  protected static prisma = new PrismaClient();

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
