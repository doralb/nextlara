export const ApiRoutesTemplate = (starter: string) => `import { apiRouter as router } from '@/lib/nextlara/Router';
import { NextResponse } from 'next/server';

/**
 * API Routes
 */
${starter === 'auth' ? `
import { AuthController } from '@/app/controllers/AuthController';
const authController = new AuthController();

router.post('/login', (req) => authController.login(req));
router.post('/register', (req) => authController.register(req));
router.post('/logout', (req) => authController.logout());
` : ''}

// Example routes (uncomment to use):
// router.get('/hello', async (request) => {
//   return NextResponse.json({ message: 'Hello from Nextlara!' });
// });

export { router };
`;

export const WebRoutesTemplate = (starter: string) => `import { router, view } from '@/lib/nextlara/Router';
import Welcome from '@/resources/views/welcome';

/**
 * Web Routes
 * 
 * Define your web page routes here
 */

router.get('/', () => view(Welcome));

${starter === 'auth' ? `
import Login from '@/resources/views/auth/login';
import Register from '@/resources/views/auth/register';
import Dashboard from '@/resources/views/dashboard';
import { auth } from '@/app/middleware/AuthMiddleware';

router.get('/login', () => view(Login));
router.get('/register', () => view(Register));

// Protected routes
router.middleware(auth, (router) => {
  router.get('/dashboard', () => view(Dashboard));
});
` : ''}

export { router };
`;

export const CatchAllApiRouteTemplate = `/**
 * Catch-all API route handler
 * 
 * This file handles all API requests using Laravel-style routes
 * defined in routes/api.ts
 */

import { handleRequest } from '@/lib/nextlara/RouteHandler';
import '@/routes/api'; // Import routes to register them

export async function GET(request: Request) {
  return handleRequest(request as any);
}

export async function POST(request: Request) {
  return handleRequest(request as any);
}

export async function PUT(request: Request) {
  return handleRequest(request as any);
}

export async function PATCH(request: Request) {
  return handleRequest(request as any);
}

export async function DELETE(request: Request) {
  return handleRequest(request as any);
}
`;

export const CatchAllWebPageTemplate = `import { router } from '@/routes/web';
import { notFound } from 'next/navigation';

/**
 * Nextlara Catch-all Web Router
 * 
 * This file handles ALL web requests and resolves them using routes/web.ts.
 * You never have to create another page.tsx file again!
 */
export default async function CatchAllWebPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const path = slug ? '/' + slug.join('/') : '/';
  const route = router.findRoute(path, 'GET');

  if (route && typeof route.handler === 'function') {
    const Component = (await route.handler()) as any;
    const routeParams = router.extractParams(route.path, path);
    return <Component params={routeParams} />;
  }

  return notFound();
}
`;
