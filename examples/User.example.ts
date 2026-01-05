/**
 * Example: User Model with custom methods
 */

import { Model } from '@/lib/laranext/Model';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export interface UserAttributes {
    id?: number;
    email: string;
    name: string;
    password: string;
    role?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class User extends Model {
    static tableName = 'users';

    /**
     * Get all users
     */
    static async all(): Promise<UserAttributes[]> {
        return await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                // Exclude password
                password: false,
            },
        });
    }

    /**
     * Find a user by ID
     */
    static async find(id: number): Promise<UserAttributes | null> {
        return await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                password: false,
            },
        });
    }

    /**
     * Find a user by email
     */
    static async findByEmail(email: string): Promise<UserAttributes | null> {
        return await prisma.user.findUnique({
            where: { email },
        });
    }

    /**
     * Create a new user with hashed password
     */
    static async create(data: Omit<UserAttributes, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserAttributes> {
        const hashedPassword = await bcrypt.hash(data.password, 10);

        return await prisma.user.create({
            data: {
                ...data,
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                password: false,
            },
        });
    }

    /**
     * Update a user
     */
    static async update(id: number, data: Partial<UserAttributes>): Promise<UserAttributes> {
        // Hash password if it's being updated
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }

        return await prisma.user.update({
            where: { id },
            data,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                password: false,
            },
        });
    }

    /**
     * Delete a user
     */
    static async delete(id: number): Promise<UserAttributes> {
        return await prisma.user.delete({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                password: false,
            },
        });
    }

    /**
     * Verify user password
     */
    static async verifyPassword(email: string, password: string): Promise<UserAttributes | null> {
        const user = await this.findByEmail(email);

        if (!user || !user.password) {
            return null;
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return null;
        }

        // Remove password from returned user
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword as UserAttributes;
    }

    /**
     * Get users by role
     */
    static async getByRole(role: string): Promise<UserAttributes[]> {
        return await prisma.user.findMany({
            where: { role },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                password: false,
            },
        });
    }
}
