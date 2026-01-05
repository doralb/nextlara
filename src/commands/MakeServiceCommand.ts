import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';

export class MakeServiceCommand {
    async handle(name: string) {
        const spinner = ora(`Creating service ${name}...`).start();

        try {
            const cwd = process.cwd();
            const servicePath = path.join(cwd, 'app/services', `${name}.ts`);

            // Check if service already exists
            if (await fs.pathExists(servicePath)) {
                spinner.fail(chalk.red(`Service ${name} already exists!`));
                return;
            }

            // Generate service content
            const serviceContent = this.generateServiceContent(name);
            await fs.writeFile(servicePath, serviceContent);

            spinner.succeed(chalk.green(`Service ${name} created successfully!`));
            console.log(chalk.cyan(`Location: ${servicePath}`));
        } catch (error) {
            spinner.fail(chalk.red(`Failed to create service ${name}`));
            console.error(error);
        }
    }

    private generateServiceContent(name: string): string {
        return `/**
 * ${name}
 * 
 * Service class for handling business logic
 */
export class ${name} {
  /**
   * Example method
   */
  async execute(data: any): Promise<any> {
    // Implement your business logic here
    
    return {
      success: true,
      data,
    };
  }

  /**
   * Add more methods as needed
   */
}

// Export singleton instance
export const ${this.toCamelCase(name)} = new ${name}();
`;
    }

    private toCamelCase(str: string): string {
        return str.charAt(0).toLowerCase() + str.slice(1);
    }
}
