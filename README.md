# 🚀 Nextlara
### Laravel-Style Development for Next.js

Hi!
This project commes from the love I had for Laravel and the benefits of using NextJs.

Nextlara brings the developer experience of Laravel to the world of Next.js.

It provides a centralized routing system, a powerful CLI (Bob), and a structured directory layout that makes building modern full-stack apps feel like home.

[![NPM Version](https://img.shields.io/npm/v/nextlara.svg)](https://www.npmjs.com/package/nextlara)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## ✨ Features

*   **Centralized Routing**: Define all your web and API routes in one place (`routes/web.ts` and `routes/api.ts`).
*   **Bob CLI**: A powerful Laravel-style command line tool to generate controllers, models, migrations, and more.
*   **Structured Excellence**: A familiar directory structure with `resources/views`, `app/controllers`, and `app/models`.
*   **Smart API Router**: Automatic `/api` prefixing and parameter binding.
*   **Master Layouts**: Centralized layouts in `resources/views/layouts`.
*   **Native Next.js Power**: Built on top of the App Router, offering full SSR, ISR, and Server Component support.

---

## 🚀 Quick Start

### 1. Install Nextlara Globally
```bash
npm install -g nextlara
```

### 2. Create a New Project
```bash
nextlara new my-awesome-app
```

### 3. Start Developing
```bash
cd my-awesome-app
npm install --legacy-peer-deps
bob dev
```

---

## 🛣️ Centralized Routing

Stop creating folders just to define a route. With Nextlara, your routing is centralized.

### **Web Routes (`routes/web.ts`)**
```typescript
import { router, view } from '@/lib/nextlara/Router';
import Welcome from '@/resources/views/welcome';
import About from '@/resources/views/about';

router.get('/', () => view(Welcome));
router.get('/about', () => view(About));
```

### **API Routes (`routes/api.ts`)**
```typescript
import { apiRouter as router } from '@/lib/nextlara/Router';

// Automatically becomes /api/hello
router.get('/hello', async (request) => {
    return NextResponse.json({ message: 'Hello from Nextlara!' });
});

// Parameter binding
router.get('/users/{id}', async (request) => {
    return NextResponse.json({ id: request.params.id });
});
```

---

## 🔨 Bob CLI Commands

Bob is your builder. Use him to scaffold your app quickly.

```bash
bob make:controller PostController --resource   # Create a resource controller
bob make:model Post -m                         # Create model and migration
bob migrate                                     # Run migrations
bob dev                                         # Start dev server
```

---

## 📂 Project Structure

```text
├── app/
│   ├── [[...slug]]/           # Magic catch-all web router
│   ├── api/                   # API catch-all handler
│   ├── controllers/           # Your Controllers
│   ├── models/                # Your Prisma Models
│   └── middleware/            # Your Middleware
├── resources/
│   └── views/                 # React components (Views)
│       ├── layouts/           # Master layouts
│       └── welcome.tsx        # Homepage view
├── routes/
│   ├── web.ts                 # Web route definitions
│   └── api.ts                 # API route definitions
└── prisma/                    # Database schema
```

---

## 📄 License

The Nextlara framework is open-sourced software licensed under the [MIT license](LICENSE).

---

## ❤️ Credits

Built with passion for developers who love the productivity of Laravel and the power of Next.js.

If you like this project, please give it a star on GitHub!
Everyone is welcome to contribute to this project, use and spread it.

The vision is to make laravel-style development for next.js as easy as possible.

We need to integrate Bun as the default package manager, Postgres as the default database and add more features.
Next we are going to add more features and more scaffolding options, Docker support and more.

If you have any questions or suggestions, please open an issue or submit a pull request.

Cheers!