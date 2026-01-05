/**
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
