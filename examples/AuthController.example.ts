/**
 * Example: Complete Authentication Controller
 */

import { Controller } from '@/lib/laranext/Controller';
import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/app/models/User';
import { validate } from 'laranext';
import { sign } from 'jsonwebtoken';
import { config } from '@/config/app';

export class AuthController extends Controller {
    /**
     * Register a new user
     * POST /api/auth/register
     */
    async register(request: NextRequest): Promise<NextResponse> {
        try {
            // Validate request
            const validation = await validate(request, {
                email: { required: true, email: true },
                password: { required: true, minLength: 8 },
                name: { required: true, minLength: 2 },
            });

            if (!validation.valid) {
                return this.error('Validation failed', 422, validation.errors);
            }

            // Check if user already exists
            const existingUser = await User.findByEmail(validation.data.email);
            if (existingUser) {
                return this.error('Email already registered', 400);
            }

            // Create user
            const user = await User.create(validation.data);

            // Generate JWT token
            const token = sign(
                { userId: user.id, email: user.email },
                config.jwt.secret,
                { expiresIn: '7d' }
            );

            return this.success(
                { user, token },
                'User registered successfully',
                201
            );
        } catch (error: any) {
            return this.error(error.message, 500);
        }
    }

    /**
     * Login user
     * POST /api/auth/login
     */
    async login(request: NextRequest): Promise<NextResponse> {
        try {
            // Validate request
            const validation = await validate(request, {
                email: { required: true, email: true },
                password: { required: true },
            });

            if (!validation.valid) {
                return this.error('Validation failed', 422, validation.errors);
            }

            // Verify credentials
            const user = await User.verifyPassword(
                validation.data.email,
                validation.data.password
            );

            if (!user) {
                return this.error('Invalid credentials', 401);
            }

            // Generate JWT token
            const token = sign(
                { userId: user.id, email: user.email },
                config.jwt.secret,
                { expiresIn: '7d' }
            );

            return this.success(
                { user, token },
                'Login successful'
            );
        } catch (error: any) {
            return this.error(error.message, 500);
        }
    }

    /**
     * Get current user
     * GET /api/auth/me
     */
    async me(request: NextRequest): Promise<NextResponse> {
        try {
            // Get user ID from middleware (set by AuthMiddleware)
            const userId = request.headers.get('x-user-id');

            if (!userId) {
                return this.error('Unauthorized', 401);
            }

            const user = await User.find(parseInt(userId));

            if (!user) {
                return this.error('User not found', 404);
            }

            return this.success(user);
        } catch (error: any) {
            return this.error(error.message, 500);
        }
    }

    /**
     * Logout user (client-side token removal)
     * POST /api/auth/logout
     */
    async logout(request: NextRequest): Promise<NextResponse> {
        return this.success(null, 'Logout successful');
    }
}
