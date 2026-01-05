import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';

export class MakeMiddlewareCommand {
    async handle(name: string) {
        const spinner = ora(`Creating middleware ${name}...`).start();

        try {
            const cwd = process.cwd();
            const middlewarePath = path.join(cwd, 'app/middleware', `${name}.ts`);

            // Check if middleware already exists
            if (await fs.pathExists(middlewarePath)) {
                spinner.fail(chalk.red(`Middleware ${name} already exists!`));
                return;
            }

            // Generate middleware content
            const middlewareContent = this.generateMiddlewareContent(name);
            await fs.writeFile(middlewarePath, middlewareContent);

            spinner.succeed(chalk.green(`Middleware ${name} created successfully!`));
            console.log(chalk.cyan(`Location: ${middlewarePath}`));
        } catch (error) {
            spinner.fail(chalk.red(`Failed to create middleware ${name}`));
            console.error(error);
        }
    }

    private generateMiddlewareContent(name: string): string {
        return `import { Middleware } from '@/lib/nextlara/Middleware';
import { NextRequest, NextResponse } from 'next/server';

/**
 * ${name}
 * 
 * Middleware for handling request/response pipeline
 */
export class ${name} extends Middleware {
  async handle(
    request: NextRequest,
    next: () => Promise<NextResponse>
  ): Promise<NextResponse> {
    // Before request processing
    console.log('${name}: Before request');
    
    // Process the request
    const response = await next();
    
    // After request processing
    console.log('${name}: After request');
    
    return response;
  }
}

// Export singleton instance
export const ${this.toCamelCase(name)} = new ${name}();
`;
    }

    private toCamelCase(str: string): string {
        return str.charAt(0).toLowerCase() + str.slice(1);
    }
}
