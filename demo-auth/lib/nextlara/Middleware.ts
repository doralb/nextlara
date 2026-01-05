import { NextRequest, NextResponse } from 'next/server';

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
