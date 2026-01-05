import { NextRequest, NextResponse } from 'next/server';
import { Middleware } from './Middleware';

/**
 * Run middleware pipeline
 * 
 * @example
 * import { withMiddleware } from 'nextlara';
 * import { AuthMiddleware } from '@/app/middleware/AuthMiddleware';
 * 
 * export const GET = withMiddleware(
 *   [new AuthMiddleware()],
 *   async (request) => {
 *     return NextResponse.json({ message: 'Protected route' });
 *   }
 * );
 */
export function withMiddleware(
    middleware: Middleware[],
    handler: (request: NextRequest, context?: any) => Promise<NextResponse>
) {
    return async (request: NextRequest, context?: any) => {
        let index = 0;

        const next = async (): Promise<NextResponse> => {
            if (index >= middleware.length) {
                return handler(request, context);
            }

            const currentMiddleware = middleware[index++];
            return currentMiddleware.handle(request, next);
        };

        return next();
    };
}

/**
 * Compose multiple middleware into a single middleware
 */
export function composeMiddleware(...middleware: Middleware[]): Middleware {
    return {
        async handle(request: NextRequest, next: () => Promise<NextResponse>) {
            return withMiddleware(middleware, async () => next())(request);
        },
    };
}
