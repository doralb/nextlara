export const BaseModelTemplate = `import { PrismaClient } from '@prisma/client';

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

export const BaseControllerTemplate = `import { NextRequest, NextResponse } from 'next/server';

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

export const ContainerTemplate = `type ServiceFactory = () => any;

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
        if (!factory) throw new Error(\\\`Service \\\${name} not found\\\`);
        instance = factory();
        this.singletons.set(name, instance);
      }
      return instance;
    }

    const factory = this.services.get(name);
    if (!factory) throw new Error(\\\`Service \\\${name} not found\\\`);
    return factory();
  }
}

export const container = new ServiceContainer();
`;

export const BaseMiddlewareTemplate = `import { NextRequest, NextResponse } from 'next/server';

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
