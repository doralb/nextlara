import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';

export class MakeControllerCommand {
  async handle(name: string, options: any) {
    const spinner = ora(`Creating controller ${name}...`).start();

    try {
      const cwd = process.cwd();
      const controllerPath = path.join(cwd, 'app/controllers', `${name}.ts`);

      // Check if controller already exists
      if (await fs.pathExists(controllerPath)) {
        spinner.fail(chalk.red(`Controller ${name} already exists!`));
        return;
      }

      // Generate controller content
      const controllerContent = options.resource
        ? this.generateResourceControllerContent(name)
        : this.generateControllerContent(name);

      await fs.writeFile(controllerPath, controllerContent);

      spinner.succeed(chalk.green(`Controller ${name} created successfully!`));
      console.log(chalk.cyan(`Location: ${controllerPath}`));

      if (options.resource) {
        console.log(chalk.yellow('\nResource controller created with methods:'));
        console.log(chalk.white('  - index()   : GET all resources'));
        console.log(chalk.white('  - show()    : GET single resource'));
        console.log(chalk.white('  - store()   : POST create resource'));
        console.log(chalk.white('  - update()  : PUT/PATCH update resource'));
        console.log(chalk.white('  - destroy() : DELETE resource'));
      }
    } catch (error) {
      spinner.fail(chalk.red(`Failed to create controller ${name}`));
      console.error(error);
    }
  }

  private generateControllerContent(name: string): string {
    return `import { Controller } from '@/lib/nextlara/Controller';
import { NextRequest, NextResponse } from 'next/server';

export class ${name} extends Controller {
  /**
   * Handle the incoming request
   */
  async handle(request: NextRequest): Promise<NextResponse> {
    try {
      // Your logic here
      
      return this.success({ message: 'Success' });
    } catch (error: any) {
      return this.error(error.message, 500);
    }
  }
}
`;
  }

  private generateResourceControllerContent(name: string): string {
    const modelName = name.replace('Controller', '');

    return `import { Controller } from '@/lib/nextlara/Controller';
import { NextRequest, NextResponse } from 'next/server';
// import { ${modelName} } from '@/app/models/${modelName}';

export class ${name} extends Controller {
  /**
   * Display a listing of the resource
   * GET /api/${this.toKebabCase(modelName)}
   */
  async index(request: NextRequest): Promise<NextResponse> {
    try {
      // const items = await ${modelName}.all();
      const items = [];
      
      return this.success(items);
    } catch (error: any) {
      return this.error(error.message, 500);
    }
  }

  /**
   * Display the specified resource
   * GET /api/${this.toKebabCase(modelName)}/{id}
   */
  async show(request: NextRequest): Promise<NextResponse> {
    try {
      const id = parseInt((request as any).params.id);
      // const item = await ${modelName}.find(id);
      
      // if (!item) {
      //   return this.error('${modelName} not found', 404);
      // }
      
      return this.success({});
    } catch (error: any) {
      return this.error(error.message, 500);
    }
  }

  /**
   * Store a newly created resource
   * POST /api/${this.toKebabCase(modelName)}
   */
  async store(request: NextRequest): Promise<NextResponse> {
    try {
      const body = await request.json();
      
      // Validate request
      // const validated = await this.validate(request, {
      //   // Add validation rules
      // });
      
      // const item = await ${modelName}.create(body);
      
      return this.success({}, '${modelName} created successfully', 201);
    } catch (error: any) {
      return this.error(error.message, 500);
    }
  }

  /**
   * Update the specified resource
   * PUT/PATCH /api/${this.toKebabCase(modelName)}/{id}
   */
  async update(request: NextRequest): Promise<NextResponse> {
    try {
      const id = parseInt((request as any).params.id);
      const body = await request.json();
      
      // const item = await ${modelName}.update(id, body);
      
      return this.success({}, '${modelName} updated successfully');
    } catch (error: any) {
      return this.error(error.message, 500);
    }
  }

  /**
   * Remove the specified resource
   * DELETE /api/${this.toKebabCase(modelName)}/{id}
   */
  async destroy(request: NextRequest): Promise<NextResponse> {
    try {
      const id = parseInt((request as any).params.id);
      
      // await ${modelName}.delete(id);
      
      return this.success(null, '${modelName} deleted successfully');
    } catch (error: any) {
      return this.error(error.message, 500);
    }
  }
}
`;
  }

  private toKebabCase(str: string): string {
    return str.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
  }
}
