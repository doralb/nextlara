/**
 * Response helpers for consistent API responses
 */

import { NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    errors?: any;
    meta?: {
        page?: number;
        perPage?: number;
        total?: number;
        totalPages?: number;
    };
}

/**
 * Success response
 */
export function successResponse<T>(
    data: T,
    message?: string,
    status = 200
): NextResponse {
    return NextResponse.json({
        success: true,
        message,
        data,
    } as ApiResponse<T>, { status });
}

/**
 * Error response
 */
export function errorResponse(
    message: string,
    status = 400,
    errors?: any
): NextResponse {
    return NextResponse.json({
        success: false,
        message,
        errors,
    } as ApiResponse, { status });
}

/**
 * Paginated response
 */
export function paginatedResponse<T>(
    data: T[],
    page: number,
    perPage: number,
    total: number,
    message?: string
): NextResponse {
    return NextResponse.json({
        success: true,
        message,
        data,
        meta: {
            page,
            perPage,
            total,
            totalPages: Math.ceil(total / perPage),
        },
    } as ApiResponse<T[]>, { status: 200 });
}

/**
 * Created response (201)
 */
export function createdResponse<T>(
    data: T,
    message = 'Resource created successfully'
): NextResponse {
    return successResponse(data, message, 201);
}

/**
 * No content response (204)
 */
export function noContentResponse(): NextResponse {
    return new NextResponse(null, { status: 204 });
}

/**
 * Not found response (404)
 */
export function notFoundResponse(
    message = 'Resource not found'
): NextResponse {
    return errorResponse(message, 404);
}

/**
 * Unauthorized response (401)
 */
export function unauthorizedResponse(
    message = 'Unauthorized'
): NextResponse {
    return errorResponse(message, 401);
}

/**
 * Forbidden response (403)
 */
export function forbiddenResponse(
    message = 'Forbidden'
): NextResponse {
    return errorResponse(message, 403);
}

/**
 * Validation error response (422)
 */
export function validationErrorResponse(
    errors: any,
    message = 'Validation failed'
): NextResponse {
    return errorResponse(message, 422, errors);
}

/**
 * Server error response (500)
 */
export function serverErrorResponse(
    message = 'Internal server error'
): NextResponse {
    return errorResponse(message, 500);
}
