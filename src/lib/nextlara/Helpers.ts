/**
 * Database query helpers and utilities
 */

export interface PaginationOptions {
    page?: number;
    perPage?: number;
}

export interface PaginationResult<T> {
    data: T[];
    meta: {
        page: number;
        perPage: number;
        total: number;
        totalPages: number;
    };
}

/**
 * Calculate pagination offset
 */
export function getPaginationOffset(page: number, perPage: number): number {
    return (page - 1) * perPage;
}

/**
 * Get pagination parameters from request
 */
export function getPaginationParams(
    searchParams: URLSearchParams,
    defaultPerPage = 15
): { page: number; perPage: number; skip: number; take: number } {
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const perPage = Math.min(
        100,
        Math.max(1, parseInt(searchParams.get('per_page') || String(defaultPerPage)))
    );
    const skip = getPaginationOffset(page, perPage);

    return {
        page,
        perPage,
        skip,
        take: perPage,
    };
}

/**
 * Create pagination result
 */
export function createPaginationResult<T>(
    data: T[],
    total: number,
    page: number,
    perPage: number
): PaginationResult<T> {
    return {
        data,
        meta: {
            page,
            perPage,
            total,
            totalPages: Math.ceil(total / perPage),
        },
    };
}

/**
 * String helpers
 */
export const str = {
    /**
     * Convert string to snake_case
     */
    snake(str: string): string {
        return str
            .replace(/([A-Z])/g, '_$1')
            .toLowerCase()
            .replace(/^_/, '');
    },

    /**
     * Convert string to camelCase
     */
    camel(str: string): string {
        return str
            .replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
            .replace(/^([A-Z])/, (letter) => letter.toLowerCase());
    },

    /**
     * Convert string to PascalCase
     */
    pascal(str: string): string {
        return str
            .replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
            .replace(/^([a-z])/, (letter) => letter.toUpperCase());
    },

    /**
     * Convert string to kebab-case
     */
    kebab(str: string): string {
        return str
            .replace(/([A-Z])/g, '-$1')
            .toLowerCase()
            .replace(/^-/, '');
    },

    /**
     * Pluralize a word (simple implementation)
     */
    plural(str: string): string {
        if (str.endsWith('y')) {
            return str.slice(0, -1) + 'ies';
        }
        if (str.endsWith('s')) {
            return str + 'es';
        }
        return str + 's';
    },

    /**
     * Singularize a word (simple implementation)
     */
    singular(str: string): string {
        if (str.endsWith('ies')) {
            return str.slice(0, -3) + 'y';
        }
        if (str.endsWith('ses')) {
            return str.slice(0, -2);
        }
        if (str.endsWith('s')) {
            return str.slice(0, -1);
        }
        return str;
    },

    /**
     * Truncate string
     */
    limit(str: string, length: number, end = '...'): string {
        if (str.length <= length) return str;
        return str.substring(0, length) + end;
    },

    /**
     * Generate random string
     */
    random(length = 16): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    },
};

/**
 * Array helpers
 */
export const arr = {
    /**
     * Chunk array into smaller arrays
     */
    chunk<T>(array: T[], size: number): T[][] {
        const chunks: T[][] = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    },

    /**
     * Get unique values from array
     */
    unique<T>(array: T[]): T[] {
        return [...new Set(array)];
    },

    /**
     * Flatten nested array
     */
    flatten<T>(array: any[]): T[] {
        return array.reduce(
            (acc, val) => acc.concat(Array.isArray(val) ? arr.flatten(val) : val),
            []
        );
    },

    /**
     * Group array by key
     */
    groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
        return array.reduce((acc, item) => {
            const groupKey = String(item[key]);
            if (!acc[groupKey]) acc[groupKey] = [];
            acc[groupKey].push(item);
            return acc;
        }, {} as Record<string, T[]>);
    },
};

/**
 * Object helpers
 */
export const obj = {
    /**
     * Pick specific keys from object
     */
    only<T extends object, K extends keyof T>(
        object: T,
        keys: K[]
    ): Pick<T, K> {
        const result = {} as Pick<T, K>;
        keys.forEach((key) => {
            if (key in object) {
                result[key] = object[key];
            }
        });
        return result;
    },

    /**
     * Omit specific keys from object
     */
    except<T extends object, K extends keyof T>(
        object: T,
        keys: K[]
    ): Omit<T, K> {
        const result = { ...object };
        keys.forEach((key) => {
            delete result[key];
        });
        return result;
    },

    /**
     * Check if object is empty
     */
    isEmpty(object: object): boolean {
        return Object.keys(object).length === 0;
    },
};
