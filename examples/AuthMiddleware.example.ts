/**
 * Example: Authentication Middleware
 * 
 * This middleware checks for a valid JWT token
 */

import { Middleware } from '@/lib/laranext/Middleware';
import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { config } from '@/config/app';

export class AuthMiddleware extends Middleware {
    async handle(
        request: NextRequest,
        next: () => Promise<NextResponse>
    ): Promise<NextResponse> {
        const authHeader = request.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized - No token provided' },
                { status: 401 }
            );
        }

        const token = authHeader.substring(7);

        try {
            const decoded = verify(token, config.jwt.secret);

            // Attach user to request (you can use headers or other methods)
            const requestHeaders = new Headers(request.headers);
            requestHeaders.set('x-user-id', (decoded as any).userId);

            const response = await next();
            return response;
        } catch (error) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized - Invalid token' },
                { status: 401 }
            );
        }
    }
}

export const authMiddleware = new AuthMiddleware();
