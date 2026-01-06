export const AuthControllerTemplate = `import { NextRequest, NextResponse } from 'next/server';
import { Controller } from '@/lib/nextlara/Controller';
import { prisma } from '@/lib/prisma';

export class AuthController extends Controller {
  async register(request: NextRequest): Promise<NextResponse> {
    try {
      const { name, email, password } = await request.json();
      if (!email || !password) return this.error('Missing fields', 422);
      
      const user = await prisma.user.create({
        data: { name, email, password } // Note: In production, you must hash the password!
      });

      return this.success({ user, message: 'User registered successfully!' });
    } catch (error: any) {
      if (error.code === 'P2002') return this.error('Email already exists', 400);
      return this.error(error.message);
    }
  }

  async login(request: NextRequest): Promise<NextResponse> {
    try {
      const { email, password } = await request.json();
      
      const user = await prisma.user.findUnique({ where: { email } });
      
      if (!user || user.password !== password) {
        return this.error('Invalid credentials', 401);
      }

      return this.success({ 
        user: { id: user.id, name: user.name, email: user.email },
        token: 'mock-session-token' 
      });
    } catch (error: any) {
      return this.error('Login failed', 400);
    }
  }

  async logout(): Promise<NextResponse> {
    return this.success({ message: 'Logged out successfully' });
  }
}
`;

export const AuthMiddlewareTemplate = `import { NextRequest, NextResponse } from 'next/server';
import { Middleware } from '@/lib/nextlara/Middleware';

export class AuthMiddleware extends Middleware {
  async handle(request: NextRequest, next: () => Promise<NextResponse>): Promise<NextResponse> {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    return next();
  }
}

export const auth = new AuthMiddleware();
`;

export const UserModelTemplate = `import { Model } from '@/lib/nextlara/Model';

export class User extends Model {
  // Define your user-specific logic here
}
`;

export const UserPolicyTemplate = `import { User } from '../models/User';

export class UserPolicy {
  /**
   * Determine if the given user can update the profile.
   */
  update(user: any, profileId: number) {
    return user.id === profileId;
  }

  /**
   * Determine if the user is an admin.
   */
  admin(user: any) {
    return user.role === 'admin';
  }
}
`;
