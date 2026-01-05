import { NextRequest, NextResponse } from 'next/server';
import { Controller } from './Controller';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RouteHandler {
    method: HttpMethod;
    handler: (request: NextRequest, context?: any) => Promise<NextResponse>;
}

/**
 * Create an API route with Laravel-style controller methods
 * 
 * @example
 * // app/api/users/route.ts
 * import { createApiRoute } from 'nextlara';
 * import { UserController } from '@/app/controllers/UserController';
 * 
 * const controller = new UserController();
 * 
 * export const { GET, POST } = createApiRoute({
 *   GET: controller.index.bind(controller),
 *   POST: controller.store.bind(controller),
 * });
 */
export function createApiRoute(handlers: Partial<Record<HttpMethod, Function>>) {
    const routes: any = {};

    for (const [method, handler] of Object.entries(handlers)) {
        routes[method] = async (request: NextRequest, context?: any) => {
            try {
                return await handler(request, context);
            } catch (error: any) {
                return NextResponse.json(
                    {
                        success: false,
                        message: error.message || 'Internal server error',
                    },
                    { status: 500 }
                );
            }
        };
    }

    return routes;
}

/**
 * Create a resource route (all CRUD operations)
 * 
 * @example
 * // app/api/users/route.ts
 * import { createResourceRoute } from 'nextlara';
 * import { UserController } from '@/app/controllers/UserController';
 * 
 * const controller = new UserController();
 * export const { GET, POST } = createResourceRoute(controller);
 * 
 * // app/api/users/[id]/route.ts
 * export const { GET, PUT, DELETE } = createResourceRoute(controller, true);
 */
export function createResourceRoute(controller: any, withId = false) {
    if (withId) {
        return createApiRoute({
            GET: controller.show?.bind(controller),
            PUT: controller.update?.bind(controller),
            PATCH: controller.update?.bind(controller),
            DELETE: controller.destroy?.bind(controller),
        });
    }

    return createApiRoute({
        GET: controller.index?.bind(controller),
        POST: controller.store?.bind(controller),
    });
}
