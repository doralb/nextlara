import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';

export class InitCommand {
  async handle() {
    const spinner = ora('Initializing Nextlara project...').start();

    try {
      const cwd = process.cwd();

      // Create directory structure
      const directories = [
        'app/models',
        'app/controllers',
        'app/services',
        'app/policies',
        'app/middleware',
        'app/validators',
        'database/migrations',
        'database/seeders',
        'config',
        'routes',
        'lib/nextlara',
      ];

      for (const dir of directories) {
        await fs.ensureDir(path.join(cwd, dir));
      }

      // Create config files
      await this.createConfigFiles(cwd);

      // Create base classes
      await this.createBaseClasses(cwd);

      // Initialize Prisma
      await this.initializePrisma(cwd);

      // Create route files
      await this.createRouteFiles(cwd);

      // Create Next.js configuration
      await this.createNextJsConfig(cwd);

      spinner.succeed(chalk.green('Nextlara project initialized successfully!'));

      console.log(chalk.cyan('\nNext steps:'));
      console.log(chalk.white('  1. Run: npm install --legacy-peer-deps'));
      console.log(chalk.white('  2. Configure your database in .env'));
      console.log(chalk.white('  3. Define your routes in routes/web.ts or routes/api.ts'));
      console.log(chalk.white('  4. Run: bob dev'));
      console.log(chalk.white('\nHappy building! 🚀'));
    } catch (error) {
      spinner.fail(chalk.red('Failed to initialize project'));
      console.error(error);
    }
  }

  private async createConfigFiles(cwd: string) {
    // Create .env.example
    const envExample = `# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

# App
APP_NAME="Nextlara App"
APP_ENV="development"
APP_URL="http://localhost:3000"

# JWT
JWT_SECRET="your-secret-key-here"
`;
    await fs.writeFile(path.join(cwd, '.env.example'), envExample);

    // Create app config
    const appConfig = `export const config = {
  app: {
    name: process.env.APP_NAME || 'Nextlara App',
    env: process.env.APP_ENV || 'development',
    url: process.env.APP_URL || 'http://localhost:3000',
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'change-me-in-production',
  },
};
`;
    await fs.writeFile(path.join(cwd, 'config/app.ts'), appConfig);
  }

  private async createBaseClasses(cwd: string) {
    // Create base Model class
    const baseModel = `import { PrismaClient } from '@prisma/client';

export class Model {
  protected static prisma = new PrismaClient();

  static async all() {
    return [];
  }

  static async find(id: any) {
    return null;
  }

  static async create(data: any) {
    return null;
  }

  static async update(id: any, data: any) {
    return null;
  }

  static async delete(id: any) {
    return null;
  }
}
`;
    await fs.writeFile(path.join(cwd, 'lib/nextlara/Model.ts'), baseModel);

    // Create base Controller class
    const baseController = `import { NextRequest, NextResponse } from 'next/server';

export class Controller {
  protected async validate(request: NextRequest, rules: any) {
    // Validation logic here
    return true;
  }

  protected success(data: any, message?: string, status = 200) {
    return NextResponse.json({
      success: true,
      message,
      data,
    }, { status });
  }

  protected error(message: string, status = 400, errors?: any) {
    return NextResponse.json({
      success: false,
      message,
      errors,
    }, { status });
  }
}
`;
    await fs.writeFile(path.join(cwd, 'lib/nextlara/Controller.ts'), baseController);

    // Create Service Container
    const serviceContainer = `type ServiceFactory = () => any;

class ServiceContainer {
  private services: Map<string, ServiceFactory> = new Map();
  private singletons: Map<string, any> = new Map();

  bind(name: string, factory: ServiceFactory) {
    this.services.set(name, factory);
  }

  singleton(name: string, factory: ServiceFactory) {
    this.services.set(name, factory);
    this.singletons.set(name, null);
  }

  make<T = any>(name: string): T {
    if (this.singletons.has(name)) {
      let instance = this.singletons.get(name);
      if (!instance) {
        const factory = this.services.get(name);
        if (!factory) throw new Error(\`Service \${name} not found\`);
        instance = factory();
        this.singletons.set(name, instance);
      }
      return instance;
    }

    const factory = this.services.get(name);
    if (!factory) throw new Error(\`Service \${name} not found\`);
    return factory();
  }
}

export const container = new ServiceContainer();
`;
    await fs.writeFile(path.join(cwd, 'lib/nextlara/Container.ts'), serviceContainer);

    // Create Middleware base
    const baseMiddleware = `import { NextRequest, NextResponse } from 'next/server';

export type MiddlewareHandler = (
  request: NextRequest,
  next: () => Promise<NextResponse>
) => Promise<NextResponse>;

export class Middleware {
  async handle(
    request: NextRequest,
    next: () => Promise<NextResponse>
  ): Promise<NextResponse> {
    return next();
  }
}
`;
    await fs.writeFile(path.join(cwd, 'lib/nextlara/Middleware.ts'), baseMiddleware);

    // Copy Router from package (look in parent node_modules or local src)
    const packageRoot = path.join(__dirname, '../../');
    let routerPath = path.join(packageRoot, 'src/lib/nextlara/Router.ts');

    // If running from installed package, files are in src/lib
    if (!await fs.pathExists(routerPath)) {
      routerPath = path.join(__dirname, '../../src/lib/nextlara/Router.ts');
    }

    const routerContent = await fs.readFile(routerPath, 'utf-8');
    await fs.writeFile(path.join(cwd, 'lib/nextlara/Router.ts'), routerContent);

    // Copy RouteHandler from package
    let routeHandlerPath = path.join(packageRoot, 'src/lib/nextlara/RouteHandler.ts');
    if (!await fs.pathExists(routeHandlerPath)) {
      routeHandlerPath = path.join(__dirname, '../../src/lib/nextlara/RouteHandler.ts');
    }

    const routeHandlerContent = await fs.readFile(routeHandlerPath, 'utf-8');
    await fs.writeFile(path.join(cwd, 'lib/nextlara/RouteHandler.ts'), routeHandlerContent);
  }

  private async initializePrisma(cwd: string) {
    const prismaSchema = `// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Example model
// model User {
//   id        Int      @id @default(autoincrement())
//   email     String   @unique
//   name      String?
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
// }
`;
    await fs.ensureDir(path.join(cwd, 'prisma'));
    await fs.writeFile(path.join(cwd, 'prisma/schema.prisma'), prismaSchema);
  }

  private async createRouteFiles(cwd: string) {
    // Create routes/api.ts
    const apiRoutes = `import { apiRouter as router } from '@/lib/nextlara/Router';
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
`;
    await fs.writeFile(path.join(cwd, 'routes/api.ts'), apiRoutes);

    // Create routes/web.ts
    const webRoutes = `import { router, view } from '@/lib/nextlara/Router';
import Welcome from '@/resources/views/welcome';

/**
 * Web Routes
 * 
 * Define your web page routes here
 */

router.get('/', () => view(Welcome));

export { router };
`;
    await fs.writeFile(path.join(cwd, 'routes/web.ts'), webRoutes);

    // Create app/api/[...slug]/route.ts for catch-all routing
    const catchAllRoute = `/**
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
    await fs.ensureDir(path.join(cwd, 'app/api/[...slug]'));
    await fs.writeFile(path.join(cwd, 'app/api/[...slug]/route.ts'), catchAllRoute);
  }

  private async createNextJsConfig(cwd: string) {
    // Create package.json
    const packageJson = {
      name: path.basename(cwd),
      version: "1.0.0",
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
        lint: "next lint"
      },
      dependencies: {
        next: "canary",
        react: "^19.0.0",
        "react-dom": "^19.0.0",
        "@prisma/client": "latest"
      },
      devDependencies: {
        "@types/node": "^20.0.0",
        "@types/react": "^19.0.0",
        "@types/react-dom": "^19.0.0",
        typescript: "^5.0.0",
        eslint: "^9.0.0",
        "eslint-config-next": "canary",
        "prisma": "latest"
      }
    };
    await fs.writeFile(
      path.join(cwd, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );

    // Create tsconfig.json
    const tsConfig = {
      compilerOptions: {
        lib: ["dom", "dom.iterable", "esnext"],
        allowJs: true,
        skipLibCheck: true,
        strict: false,
        noEmit: true,
        esModuleInterop: true,
        module: "esnext",
        moduleResolution: "bundler",
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: "preserve",
        incremental: true,
        plugins: [{ name: "next" }],
        paths: { "@/*": ["./*"] }
      },
      include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
      exclude: ["node_modules"]
    };
    await fs.writeFile(
      path.join(cwd, 'tsconfig.json'),
      JSON.stringify(tsConfig, null, 2)
    );

    // Create next.config.js
    const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig
`;
    await fs.writeFile(path.join(cwd, 'next.config.js'), nextConfig);

    // Create .eslintrc.json
    const eslintConfig = {
      extends: "next/core-web-vitals"
    };
    await fs.writeFile(
      path.join(cwd, '.eslintrc.json'),
      JSON.stringify(eslintConfig, null, 2)
    );

    // Create resources/views directory
    await fs.ensureDir(path.join(cwd, 'resources/views/layouts'));

    // Create resources/views/welcome.tsx
    const welcomeView = `export default function Welcome() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>🚀 Nextlara - Laravel for Next.js</h1>
      <p>Your app is ready! This view is located in <code>resources/views/welcome.tsx</code></p>
      
      <h2>Quick Start:</h2>
      <ol>
        <li>Define routes in <code>routes/web.ts</code> or <code>routes/api.ts</code></li>
        <li>Create views in <code>resources/views</code></li>
        <li>Create controllers with <code>bob make:controller</code></li>
      </ol>

      <h2>Example Routes:</h2>
      <ul>
        <li><a href="/api/hello">/api/hello</a></li>
      </ul>
    </div>
  );
}
`;
    await fs.writeFile(path.join(cwd, 'resources/views/welcome.tsx'), welcomeView);

    // Create resources/views/layouts/app.tsx
    const appLayout = `import React from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="nextlara-app">
      {children}
    </div>
  );
}
`;
    await fs.writeFile(path.join(cwd, 'resources/views/layouts/app.tsx'), appLayout);

    // Create app/layout.tsx (Proxy to resources/views/layouts/app.tsx)
    const layout = `import AppLayout from '@/resources/views/layouts/app';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  )
}
`;
    await fs.writeFile(path.join(cwd, 'app/layout.tsx'), layout);

    // Create app/[[...slug]]/page.tsx (The Ultimate Central Web Router)
    const catchAllWebPage = `import { router } from '@/routes/web';
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
    await fs.ensureDir(path.join(cwd, 'app/[[...slug]]'));
    await fs.writeFile(path.join(cwd, 'app/[[...slug]]/page.tsx'), catchAllWebPage);

    // Create .gitignore
    const gitignore = `# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
`;
    await fs.writeFile(path.join(cwd, '.gitignore'), gitignore);
  }
}
