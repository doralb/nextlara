import { apiRouter as router } from '@/lib/nextlara/Router';
import { NextResponse } from 'next/server';

/**
 * API Routes
 * 
 * Define your API routes here using Laravel-style routing
 */

// Example routes (uncomment to use):
// import { PostController } from '@/app/controllers/PostController';
// const postController = new PostController();

// Simple routes
// router.get('/api/hello', async (request) => {
//   return NextResponse.json({ message: 'Hello from Nextlara!' });
// });

// Resource routes
// router.resource('/api/posts', postController);

// Grouped routes with prefix
// router.prefix('/api/v1', (router) => {
//   router.resource('/posts', postController);
//   router.resource('/users', userController);
// });

// Grouped routes with middleware
// import { authMiddleware } from '@/app/middleware/AuthMiddleware';
// router.middleware(authMiddleware, (router) => {
//   router.resource('/api/posts', postController);
// });

// Combined prefix and middleware
// router.group({ prefix: '/api/admin', middleware: [authMiddleware] }, (router) => {
//   router.resource('/posts', postController);
//   router.resource('/users', userController);
// });

export { router };
