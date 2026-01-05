/**
 * Example: API Routes for Authentication
 */

// File: app/api/auth/register/route.ts
import { createApiRoute } from 'laranext';
import { AuthController } from '@/app/controllers/AuthController';

const controller = new AuthController();

export const { POST } = createApiRoute({
    POST: controller.register.bind(controller),
});

// File: app/api/auth/login/route.ts
// import { createApiRoute } from 'laranext';
// import { AuthController } from '@/app/controllers/AuthController';
//
// const controller = new AuthController();
//
// export const { POST } = createApiRoute({
//   POST: controller.login.bind(controller),
// });

// File: app/api/auth/me/route.ts
// import { createApiRoute, withMiddleware } from 'laranext';
// import { AuthController } from '@/app/controllers/AuthController';
// import { AuthMiddleware } from '@/app/middleware/AuthMiddleware';
//
// const controller = new AuthController();
//
// export const GET = withMiddleware(
//   [new AuthMiddleware()],
//   controller.me.bind(controller)
// );

// File: app/api/auth/logout/route.ts
// import { createApiRoute, withMiddleware } from 'laranext';
// import { AuthController } from '@/app/controllers/AuthController';
// import { AuthMiddleware } from '@/app/middleware/AuthMiddleware';
//
// const controller = new AuthController();
//
// export const POST = withMiddleware(
//   [new AuthMiddleware()],
//   controller.logout.bind(controller)
// );
