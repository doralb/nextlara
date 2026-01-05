import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';

export class InitCommand {
  private starter: string = 'basic';

  async handle() {
    // Stop spinner to show prompt
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'starter',
        message: 'Which starter kit would you like to use?',
        choices: [
          { name: 'Basic (Routing + CLI)', value: 'basic' },
          { name: 'SaaS Starter Kit (Auth + Dashboard + Prisma)', value: 'auth' }
        ],
        default: 'basic'
      }
    ]);

    this.starter = answers.starter;

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

      // Create Auth scaffolding if needed
      if (this.starter === 'auth') {
        await this.createAuthScaffolding(cwd);
      }

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
    let prismaSchema = `// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Nextlara Starter Models
`;

    if (this.starter === 'auth') {
      prismaSchema += `
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Session {
  id        String   @id @default(cuid())
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  expiresAt DateTime
}
`;
    } else {
      prismaSchema += `
// Example model
// model User {
//   id        Int      @id @default(autoincrement())
//   email     String   @unique
//   name      String?
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
// }
`;
    }

    await fs.ensureDir(path.join(cwd, 'prisma'));
    await fs.writeFile(path.join(cwd, 'prisma/schema.prisma'), prismaSchema);
  }

  private async createRouteFiles(cwd: string) {
    // Create routes/api.ts
    let apiRoutes = `import { apiRouter as router } from '@/lib/nextlara/Router';
import { NextResponse } from 'next/server';

/**
 * API Routes
 */
`;

    if (this.starter === 'auth') {
      apiRoutes += `
import { AuthController } from '@/app/controllers/AuthController';
const authController = new AuthController();

router.post('/login', (req) => authController.login(req));
router.post('/register', (req) => authController.register(req));
router.post('/logout', (req) => authController.logout());
`;
    }

    apiRoutes += `
// Example routes (uncomment to use):
// router.get('/hello', async (request) => {
//   return NextResponse.json({ message: 'Hello from Nextlara!' });
// });

export { router };
`;
    await fs.writeFile(path.join(cwd, 'routes/api.ts'), apiRoutes);

    // Create routes/web.ts
    let webRoutes = `import { router, view } from '@/lib/nextlara/Router';
import Welcome from '@/resources/views/welcome';

/**
 * Web Routes
 * 
 * Define your web page routes here
 */

router.get('/', () => view(Welcome));
`;

    if (this.starter === 'auth') {
      webRoutes += `
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
`;
    }

    webRoutes += `
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
    const dependencies: any = {
      next: "canary",
      react: "^19.0.0",
      "react-dom": "^19.0.0",
      "@prisma/client": "latest"
    };

    if (this.starter === 'auth') {
      dependencies["lucide-react"] = "latest";
      dependencies["framer-motion"] = "latest";
      dependencies["clsx"] = "latest";
      dependencies["tailwind-merge"] = "latest";
    }

    const packageJson = {
      name: path.basename(cwd),
      version: "1.0.0",
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
        lint: "next lint"
      },
      dependencies,
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
    const welcomeView = `import React from 'react';

export default function Welcome() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0f172a', 
      color: '#f8fafc', 
      fontFamily: 'Inter, system-ui, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, #38bdf8, transparent)',
      }} />
      
      <div style={{
        maxWidth: '800px',
      }}>
        <div style={{
          display: 'inline-block',
          padding: '2px',
          background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
          borderRadius: '12px',
          marginBottom: '2rem',
          boxShadow: '0 0 20px rgba(56, 189, 248, 0.2)'
        }}>
          <div style={{
            backgroundColor: '#0f172a',
            borderRadius: '10px',
            padding: '1rem 2rem',
            fontSize: '1.25rem',
            fontWeight: 'bold',
          }}>
            Nextlara 1.0.6
          </div>
        </div>

        <h1 style={{ 
          fontSize: '4rem', 
          fontWeight: '800', 
          marginBottom: '1rem',
          letterSpacing: '-0.025em',
          background: 'linear-gradient(to bottom right, #ffffff 40%, #94a3b8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Laravel Elegance.<br />
          Next.js Power.
        </h1>
        
        <p style={{ 
          fontSize: '1.25rem', 
          color: '#94a3b8', 
          marginBottom: '3rem',
          lineHeight: '1.6'
        }}>
          Experience the world's most productive full-stack framework for Next.js. 
          Centralized routing, powerful CLI, and a structure that feels like home.
        </p>

        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <a href="https://github.com/doralb/nextlara" style={{
            backgroundColor: '#f8fafc',
            color: '#0f172a',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontWeight: '600',
            textDecoration: 'none',
            transition: 'all 0.2s',
          }}>
            Documentation
          </a>
          ${this.starter === 'auth' ? `
          <a href="/dashboard" style={{
            backgroundColor: '#38bdf8',
            color: '#0f172a',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontWeight: '600',
            textDecoration: 'none',
            transition: 'all 0.2s',
          }}>
            Go to Dashboard
          </a>
          ` : `
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontFamily: 'monospace',
            color: '#38bdf8'
          }}>
            bob make:controller
          </div>
          `}
        </div>

        <div style={{ 
          marginTop: '5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          textAlign: 'left'
        }}>
          <div style={{ padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}>
            <h3 style={{ marginBottom: '0.5rem', color: '#38bdf8' }}>Routes</h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Centralized in routes/web.ts. No more messy folders.</p>
          </div>
          <div style={{ padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}>
            <h3 style={{ marginBottom: '0.5rem', color: '#38bdf8' }}>CLI</h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Bob builds everything. Models, migrations, controllers.</p>
          </div>
          <div style={{ padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}>
            <h3 style={{ marginBottom: '0.5rem', color: '#38bdf8' }}>Views</h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Clean separation. Your React components in resources/views.</p>
          </div>
        </div>
      </div>
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

  private async createAuthScaffolding(cwd: string) {
    // Create AuthController
    const authController = `import { NextRequest, NextResponse } from 'next/server';
import { Controller } from '@/lib/nextlara/Controller';

export class AuthController extends Controller {
  async register(request: NextRequest): Promise<NextResponse> {
    try {
      // In a real app, you would validate and save to DB
      // const user = await User.create(request.body);
      return this.success({ message: 'User registered successfully' });
    } catch (error: any) {
      return this.error(error.message);
    }
  }

  async login(request: NextRequest): Promise<NextResponse> {
    try {
      return this.success({ token: 'mock-jwt-token' });
    } catch (error: any) {
      return this.error('Invalid credentials', 401);
    }
  }

  async logout(): Promise<NextResponse> {
    return this.success({ message: 'Logged out successfully' });
  }
}
`;
    await fs.writeFile(path.join(cwd, 'app/controllers/AuthController.ts'), authController);

    // Create AuthMiddleware
    const authMiddleware = `import { NextRequest, NextResponse } from 'next/server';
import { Middleware } from '@/lib/nextlara/Middleware';

export class AuthMiddleware extends Middleware {
  async handle(request: NextRequest, next: () => Promise<NextResponse>): Promise<NextResponse> {
    // Example: Check for Auth header or session cookie
    const token = request.headers.get('authorization');
    
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    return next();
  }
}

export const auth = new AuthMiddleware();
`;
    await fs.writeFile(path.join(cwd, 'app/middleware/AuthMiddleware.ts'), authMiddleware);

    // Create Auth Views
    await fs.ensureDir(path.join(cwd, 'resources/views/auth'));

    const loginView = `import React from 'react';

export default function Login() {
  return (
    <div style={{ backgroundColor: '#0f172a', color: 'white', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: '#1e293b', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '400px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Nextlara Login</h2>
        <input type="email" placeholder="Email" style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '6px', border: 'none', backgroundColor: '#0f172a', color: 'white' }} />
        <input type="password" placeholder="Password" style={{ width: '100%', padding: '0.75rem', marginBottom: '1.5rem', borderRadius: '6px', border: 'none', backgroundColor: '#0f172a', color: 'white' }} />
        <button style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: 'none', backgroundColor: '#38bdf8', color: '#0f172a', fontWeight: 'bold' }}>Sign In</button>
        <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem', color: '#94a3b8' }}>Don't have an account? <a href="/register" style={{ color: '#38bdf8' }}>Register</a></p>
      </div>
    </div>
  );
}
`;
    await fs.writeFile(path.join(cwd, 'resources/views/auth/login.tsx'), loginView);

    const registerView = `import React from 'react';

export default function Register() {
  return (
    <div style={{ backgroundColor: '#0f172a', color: 'white', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: '#1e293b', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '400px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Create Account</h2>
        <input type="text" placeholder="Full Name" style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '6px', border: 'none', backgroundColor: '#0f172a', color: 'white' }} />
        <input type="email" placeholder="Email" style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '6px', border: 'none', backgroundColor: '#0f172a', color: 'white' }} />
        <input type="password" placeholder="Password" style={{ width: '100%', padding: '0.75rem', marginBottom: '1.5rem', borderRadius: '6px', border: 'none', backgroundColor: '#0f172a', color: 'white' }} />
        <button style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: 'none', backgroundColor: '#38bdf8', color: '#0f172a', fontWeight: 'bold' }}>Register</button>
        <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem', color: '#94a3b8' }}>Already have an account? <a href="/login" style={{ color: '#38bdf8' }}>Login</a></p>
      </div>
    </div>
  );
}
`;
    await fs.writeFile(path.join(cwd, 'resources/views/auth/register.tsx'), registerView);

    const dashboardView = `import React from 'react';

export default function Dashboard() {
  return (
    <div style={{ backgroundColor: '#0f172a', color: 'white', minHeight: '100vh', display: 'flex' }}>
      <div style={{ width: '260px', borderRight: '1px solid rgba(255,255,255,0.1)', padding: '2rem' }}>
        <h2 style={{ color: '#38bdf8', marginBottom: '2rem' }}>Nextlara</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <a href="/dashboard" style={{ color: '#38bdf8', textDecoration: 'none' }}>Dashboard</a>
          <a href="/profile" style={{ color: '#94a3b8', textDecoration: 'none' }}>Profile</a>
          <a href="/settings" style={{ color: '#94a3b8', textDecoration: 'none' }}>Settings</a>
          <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <a href="/" style={{ color: '#ef4444', textDecoration: 'none' }}>Logout</a>
          </div>
        </nav>
      </div>
      <div style={{ flex: 1, padding: '3rem' }}>
        <h1 style={{ marginBottom: '2rem' }}>Welcome to your Dashboard</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {[1,2,3].map(i => (
            <div key={i} style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h4 style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>Stat {i}</h4>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>$4,500</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
`;
    await fs.writeFile(path.join(cwd, 'resources/views/dashboard.tsx'), dashboardView);
  }
}
