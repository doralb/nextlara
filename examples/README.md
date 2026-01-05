# Laranext Examples

This directory contains example implementations to help you get started with Laranext.

## Available Examples

### 1. Authentication System (`AuthController.example.ts`)
Complete authentication controller with:
- User registration
- Login
- Get current user
- Logout

### 2. User Model (`User.example.ts`)
Advanced user model with:
- Password hashing
- Email lookup
- Password verification
- Role-based queries

### 3. Authentication Middleware (`AuthMiddleware.example.ts`)
JWT-based authentication middleware for protecting routes

### 4. API Routes (`auth-routes.example.ts`)
Example route files showing how to wire up controllers

## Using These Examples

1. Copy the example files to your project
2. Remove the `.example.ts` extension
3. Adjust imports and paths as needed
4. Customize to fit your requirements

## Complete Blog Example

Here's how to build a complete blog with Laranext:

### Step 1: Initialize Project

\`\`\`bash
npx bob init
\`\`\`

### Step 2: Create Models

\`\`\`bash
npx bob make:model User --migration
npx bob make:model Post --migration
npx bob make:model Comment --migration
\`\`\`

### Step 3: Update Prisma Schema

\`\`\`prisma
model User {
  id        Int       @id @default(autoincrement())
  email     String    @unique
  name      String
  password  String
  role      String    @default("user")
  posts     Post[]
  comments  Comment[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Post {
  id        Int       @id @default(autoincrement())
  title     String
  content   String
  published Boolean   @default(false)
  userId    Int
  user      User      @relation(fields: [userId], references: [id])
  comments  Comment[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Comment {
  id        Int      @id @default(autoincrement())
  content   String
  postId    Int
  post      Post     @relation(fields: [postId], references: [id])
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
\`\`\`

### Step 4: Run Migrations

\`\`\`bash
npx bob migrate
\`\`\`

### Step 5: Create Controllers

\`\`\`bash
npx bob make:controller AuthController
npx bob make:controller PostController --resource
npx bob make:controller CommentController --resource
\`\`\`

### Step 6: Create Policies

\`\`\`bash
npx bob make:policy PostPolicy --model Post
npx bob make:policy CommentPolicy --model Comment
\`\`\`

### Step 7: Create Middleware

\`\`\`bash
npx bob make:middleware AuthMiddleware
npx bob make:middleware AdminMiddleware
\`\`\`

### Step 8: Create Services

\`\`\`bash
npx bob make:service EmailService
npx bob make:service NotificationService
\`\`\`

### Step 9: Set Up Routes

Create your API routes in the \`app/api\` directory following Next.js conventions.

## More Examples Coming Soon

- File upload handling
- Email notifications
- Real-time features with WebSockets
- Background jobs
- API rate limiting
- Caching strategies

## Contributing

Have a great example? Submit a PR!
