import { NextRequest } from 'next/server';

export interface ValidationRule {
    required?: boolean;
    email?: boolean;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => boolean | string;
}

export type ValidationRules = Record<string, ValidationRule>;

export interface ValidationError {
    field: string;
    message: string;
}

/**
 * Validate request data against rules
 * 
 * @example
 * const errors = await validate(request, {
 *   email: { required: true, email: true },
 *   password: { required: true, minLength: 8 },
 *   age: { min: 18, max: 100 },
 * });
 */
export async function validate(
    request: NextRequest,
    rules: ValidationRules
): Promise<{ valid: boolean; errors: ValidationError[]; data: any }> {
    const errors: ValidationError[] = [];
    let data: any = {};

    try {
        const contentType = request.headers.get('content-type');

        if (contentType?.includes('application/json')) {
            data = await request.json();
        } else if (contentType?.includes('multipart/form-data') || contentType?.includes('application/x-www-form-urlencoded')) {
            const formData = await request.formData();
            data = Object.fromEntries(formData);
        }
    } catch (error) {
        errors.push({ field: '_request', message: 'Invalid request body' });
        return { valid: false, errors, data: {} };
    }

    for (const [field, rule] of Object.entries(rules)) {
        const value = data[field];

        // Required validation
        if (rule.required && (value === undefined || value === null || value === '')) {
            errors.push({ field, message: `${field} is required` });
            continue;
        }

        // Skip other validations if value is empty and not required
        if (!rule.required && (value === undefined || value === null || value === '')) {
            continue;
        }

        // Email validation
        if (rule.email && !isValidEmail(value)) {
            errors.push({ field, message: `${field} must be a valid email` });
        }

        // Min/Max number validation
        if (rule.min !== undefined && Number(value) < rule.min) {
            errors.push({ field, message: `${field} must be at least ${rule.min}` });
        }

        if (rule.max !== undefined && Number(value) > rule.max) {
            errors.push({ field, message: `${field} must be at most ${rule.max}` });
        }

        // String length validation
        if (rule.minLength !== undefined && String(value).length < rule.minLength) {
            errors.push({ field, message: `${field} must be at least ${rule.minLength} characters` });
        }

        if (rule.maxLength !== undefined && String(value).length > rule.maxLength) {
            errors.push({ field, message: `${field} must be at most ${rule.maxLength} characters` });
        }

        // Pattern validation
        if (rule.pattern && !rule.pattern.test(String(value))) {
            errors.push({ field, message: `${field} format is invalid` });
        }

        // Custom validation
        if (rule.custom) {
            const result = rule.custom(value);
            if (result !== true) {
                errors.push({ field, message: typeof result === 'string' ? result : `${field} is invalid` });
            }
        }
    }

    return {
        valid: errors.length === 0,
        errors,
        data,
    };
}

function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validator class for more complex validation scenarios
 */
export class Validator {
    private rules: ValidationRules;
    private data: any;
    private errors: ValidationError[] = [];

    constructor(data: any, rules: ValidationRules) {
        this.data = data;
        this.rules = rules;
    }

    async validate(): Promise<boolean> {
        const result = await validate(
            { json: async () => this.data } as any,
            this.rules
        );
        this.errors = result.errors;
        return result.valid;
    }

    getErrors(): ValidationError[] {
        return this.errors;
    }

    getErrorMessages(): Record<string, string[]> {
        const messages: Record<string, string[]> = {};
        for (const error of this.errors) {
            if (!messages[error.field]) {
                messages[error.field] = [];
            }
            messages[error.field].push(error.message);
        }
        return messages;
    }
}
