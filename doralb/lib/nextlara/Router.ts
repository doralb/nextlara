import { NextRequest, NextResponse } from 'next/server';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';

export interface RouteHandler {
    method: HttpMethod;
    path: string;
    handler: (request: NextRequest, params?: any) => Promise<NextResponse>;
    middleware?: any[];
}

export interface RouteGroup {
    prefix?: string;
    middleware?: any[];
    routes: RouteDefinition[];
}

export type RouteDefinition = RouteHandler | RouteGroup;

class Router {
    private routes: Map<string, Map<HttpMethod, RouteHandler>> = new Map();
    private currentPrefix: string = '';
    private currentMiddleware: any[] = [];

    /**
     * Register a GET route
     */
    get(path: string, handler: Function, middleware: any[] = []) {
        return this.addRoute('GET', path, handler, middleware);
    }

    /**
     * Register a POST route
     */
    post(path: string, handler: Function, middleware: any[] = []) {
        return this.addRoute('POST', path, handler, middleware);
    }

    /**
     * Register a PUT route
     */
    put(path: string, handler: Function, middleware: any[] = []) {
        return this.addRoute('PUT', path, handler, middleware);
    }

    /**
     * Register a PATCH route
     */
    patch(path: string, handler: Function, middleware: any[] = []) {
        return this.addRoute('PATCH', path, handler, middleware);
    }

    /**
     * Register a DELETE route
     */
    delete(path: string, handler: Function, middleware: any[] = []) {
        return this.addRoute('DELETE', path, handler, middleware);
    }

    /**
     * Register multiple HTTP methods for the same route
     */
    match(methods: HttpMethod[], path: string, handler: Function, middleware: any[] = []) {
        methods.forEach(method => {
            this.addRoute(method, path, handler, middleware);
        });
        return this;
    }

    /**
     * Register all HTTP methods for a route
     */
    any(path: string, handler: Function, middleware: any[] = []) {
        const methods: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
        return this.match(methods, path, handler, middleware);
    }

    /**
     * Create a resource route (RESTful)
     */
    resource(path: string, controller: any, middleware: any[] = []) {
        const basePath = path.replace(/\/$/, '');

        this.get(basePath, controller.index?.bind(controller), middleware);
        this.post(basePath, controller.store?.bind(controller), middleware);
        this.get(`${basePath}/{id}`, controller.show?.bind(controller), middleware);
        this.put(`${basePath}/{id}`, controller.update?.bind(controller), middleware);
        this.patch(`${basePath}/{id}`, controller.update?.bind(controller), middleware);
        this.delete(`${basePath}/{id}`, controller.destroy?.bind(controller), middleware);

        return this;
    }

    /**
     * Create an API resource route
     */
    apiResource(path: string, controller: any, middleware: any[] = []) {
        return this.resource(path, controller, middleware);
    }

    /**
     * Group routes with common attributes
     */
    group(attributes: { prefix?: string; middleware?: any[] }, callback: (router: Router) => void) {
        const previousPrefix = this.currentPrefix;
        const previousMiddleware = [...this.currentMiddleware];

        if (attributes.prefix) {
            this.currentPrefix = this.joinPaths(this.currentPrefix, attributes.prefix);
        }

        if (attributes.middleware) {
            this.currentMiddleware = [...this.currentMiddleware, ...attributes.middleware];
        }

        callback(this);

        this.currentPrefix = previousPrefix;
        this.currentMiddleware = previousMiddleware;

        return this;
    }

    /**
     * Add a route prefix
     */
    prefix(prefix: string, callback: (router: Router) => void) {
        return this.group({ prefix }, callback);
    }

    /**
     * Add middleware to routes
     */
    middleware(middleware: any | any[], callback: (router: Router) => void) {
        const middlewareArray = Array.isArray(middleware) ? middleware : [middleware];
        return this.group({ middleware: middlewareArray }, callback);
    }

    /**
     * Add a route to the router
     */
    private addRoute(method: HttpMethod, path: string, handler: Function, middleware: any[] = []) {
        const fullPath = this.joinPaths(this.currentPrefix, path);
        const allMiddleware = [...this.currentMiddleware, ...middleware];

        if (!this.routes.has(fullPath)) {
            this.routes.set(fullPath, new Map());
        }

        const routeMap = this.routes.get(fullPath)!;
        routeMap.set(method, {
            method,
            path: fullPath,
            handler: handler as any,
            middleware: allMiddleware,
        });

        return this;
    }

    /**
     * Join path segments
     */
    private joinPaths(...paths: string[]): string {
        return '/' + paths
            .filter(p => p)
            .map(p => p.replace(/^\/|\/$/g, ''))
            .filter(p => p)
            .join('/');
    }

    /**
     * Get all registered routes
     */
    getRoutes(): Map<string, Map<HttpMethod, RouteHandler>> {
        return this.routes;
    }

    /**
     * Find a route by path and method
     */
    findRoute(path: string, method: HttpMethod): RouteHandler | null {
        // Exact match
        const routeMap = this.routes.get(path);
        if (routeMap?.has(method)) {
            return routeMap.get(method)!;
        }

        // Dynamic route matching
        for (const [routePath, methods] of this.routes.entries()) {
            const params = this.matchPath(routePath, path);
            if (params !== null && methods.has(method)) {
                const route = methods.get(method)!;
                return { ...route, handler: route.handler };
            }
        }

        return null;
    }

    /**
     * Match a route path with dynamic segments
     */
    private matchPath(routePath: string, requestPath: string): Record<string, string> | null {
        const routeSegments = routePath.split('/').filter(s => s);
        const requestSegments = requestPath.split('/').filter(s => s);

        if (routeSegments.length !== requestSegments.length) {
            return null;
        }

        const params: Record<string, string> = {};

        for (let i = 0; i < routeSegments.length; i++) {
            const routeSegment = routeSegments[i];
            const requestSegment = requestSegments[i];

            if (routeSegment.startsWith('{') && routeSegment.endsWith('}')) {
                const paramName = routeSegment.slice(1, -1);
                params[paramName] = requestSegment;
            } else if (routeSegment !== requestSegment) {
                return null;
            }
        }

        return params;
    }

    /**
     * Extract parameters from path
     */
    extractParams(routePath: string, requestPath: string): Record<string, string> {
        return this.matchPath(routePath, requestPath) || {};
    }
}

// Export singleton instance
export const router = new Router();

// Export class for custom instances
export { Router };

/**
 * Smart API Router proxy that automatically prepends /api
 */
export const apiRouter = new Proxy(router, {
    get(target, prop) {
        const methods = ['get', 'post', 'put', 'patch', 'delete', 'resource', 'apiResource'];
        if (methods.includes(prop as string)) {
            return (path: string, ...args: any[]) => {
                const prefixedPath = path.startsWith('/api')
                    ? path
                    : `/api${path.startsWith('/') ? '' : '/'}${path}`;
                return (target as any)[prop](prefixedPath, ...args);
            };
        }
        return (target as any)[prop];
    }
});

/**
 * View helper for returning React components
 */
export function view(component: any) {
    return component;
}
