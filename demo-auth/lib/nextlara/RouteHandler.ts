import { NextRequest, NextResponse } from 'next/server';
import { router, Router, RouteHandler } from './Router';

/**
 * Handle incoming requests using Laravel-style routes
 */
export async function handleRequest(request: NextRequest): Promise<NextResponse> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method as any;

    // Find matching route
    const route = router.findRoute(path, method);

    if (!route) {
        return NextResponse.json(
            { success: false, message: 'Route not found' },
            { status: 404 }
        );
    }

    try {
        // Extract route parameters
        const params = router.extractParams(route.path, path);

        // Attach params to request for easy access (Laravel style)
        (request as any).params = params;

        // Run middleware pipeline
        if (route.middleware && route.middleware.length > 0) {
            const response = await runMiddleware(request, route.middleware, params);
            if (response) return response;
        }

        // Execute route handler
        const response = await route.handler(request, { params });
        return response;
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * Run middleware pipeline
 */
async function runMiddleware(
    request: NextRequest,
    middleware: any[],
    params?: any
): Promise<NextResponse | null> {
    for (const mw of middleware) {
        let shouldContinue = true;
        let response: NextResponse | null = null;

        const next = async () => {
            shouldContinue = true;
            return NextResponse.next();
        };

        if (typeof mw === 'function') {
            response = await mw(request, next, params);
        } else if (mw.handle) {
            response = await mw.handle(request, next, params);
        }

        if (response && response.status !== 200) {
            return response;
        }

        if (!shouldContinue) {
            return response;
        }
    }

    return null;
}

/**
 * Create a catch-all route handler for Next.js
 */
export function createRouteHandler() {
    return {
        GET: async (request: NextRequest, context?: any) => handleRequest(request),
        POST: async (request: NextRequest, context?: any) => handleRequest(request),
        PUT: async (request: NextRequest, context?: any) => handleRequest(request),
        PATCH: async (request: NextRequest, context?: any) => handleRequest(request),
        DELETE: async (request: NextRequest, context?: any) => handleRequest(request),
    };
}
