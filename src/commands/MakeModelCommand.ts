import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import { MakeMigrationCommand } from './MakeMigrationCommand';

export class MakeModelCommand {
  async handle(name: string, options: any) {
    const spinner = ora(`Creating model ${name}...`).start();

    try {
      const cwd = process.cwd();
      const modelPath = path.join(cwd, 'app/models', `${name}.ts`);

      // Check if model already exists
      if (await fs.pathExists(modelPath)) {
        spinner.fail(chalk.red(`Model ${name} already exists!`));
        return;
      }

      // Generate model content
      const modelContent = this.generateModelContent(name);
      await fs.writeFile(modelPath, modelContent);

      spinner.succeed(chalk.green(`Model ${name} created successfully!`));
      console.log(chalk.cyan(`Location: ${modelPath}`));

      // Create migration if requested
      if (options.migration) {
        await new MakeMigrationCommand().handle(`create_${this.toSnakeCase(name)}_table`);
      }
    } catch (error) {
      spinner.fail(chalk.red(`Failed to create model ${name}`));
      console.error(error);
    }
  }

  private generateModelContent(name: string): string {
    const tableName = this.toSnakeCase(name) + 's';

    return `import { Model } from '@/lib/nextlara/Model';
import { prisma } from '@/lib/prisma';

export interface ${name}Attributes {
  id?: number;
  // Add your model attributes here
  createdAt?: Date;
  updatedAt?: Date;
}

export class ${name} extends Model {
  static tableName = '${tableName}';

  /**
   * Get all ${name} records
   */
  static async all(): Promise<${name}Attributes[]> {
    return await prisma.${this.toCamelCase(name)}.findMany();
  }

  /**
   * Find a ${name} by ID
   */
  static async find(id: number): Promise<${name}Attributes | null> {
    return await prisma.${this.toCamelCase(name)}.findUnique({
      where: { id },
    });
  }

  /**
   * Create a new ${name}
   */
  static async create(data: Omit<${name}Attributes, 'id' | 'createdAt' | 'updatedAt'>): Promise<${name}Attributes> {
    return await prisma.${this.toCamelCase(name)}.create({
      data,
    });
  }

  /**
   * Update a ${name}
   */
  static async update(id: number, data: Partial<${name}Attributes>): Promise<${name}Attributes> {
    return await prisma.${this.toCamelCase(name)}.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a ${name}
   */
  static async delete(id: number): Promise<${name}Attributes> {
    return await prisma.${this.toCamelCase(name)}.delete({
      where: { id },
    });
  }

  /**
   * Find records matching criteria
   */
  static async where(criteria: Partial<${name}Attributes>): Promise<${name}Attributes[]> {
    return await prisma.${this.toCamelCase(name)}.findMany({
      where: criteria,
    });
  }

  /**
   * Find first record matching criteria
   */
  static async first(criteria: Partial<${name}Attributes>): Promise<${name}Attributes | null> {
    return await prisma.${this.toCamelCase(name)}.findFirst({
      where: criteria,
    });
  }
}
`;
  }

  private toSnakeCase(str: string): string {
    return str.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
  }

  private toCamelCase(str: string): string {
    return str.charAt(0).toLowerCase() + str.slice(1);
  }
}
