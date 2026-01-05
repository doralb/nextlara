import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';

export class MakePolicyCommand {
    async handle(name: string, options: any) {
        const spinner = ora(`Creating policy ${name}...`).start();

        try {
            const cwd = process.cwd();
            const policyPath = path.join(cwd, 'app/policies', `${name}.ts`);

            // Check if policy already exists
            if (await fs.pathExists(policyPath)) {
                spinner.fail(chalk.red(`Policy ${name} already exists!`));
                return;
            }

            // Generate policy content
            const policyContent = this.generatePolicyContent(name, options.model);
            await fs.writeFile(policyPath, policyContent);

            spinner.succeed(chalk.green(`Policy ${name} created successfully!`));
            console.log(chalk.cyan(`Location: ${policyPath}`));
        } catch (error) {
            spinner.fail(chalk.red(`Failed to create policy ${name}`));
            console.error(error);
        }
    }

    private generatePolicyContent(name: string, modelName?: string): string {
        const model = modelName || 'Resource';

        return `/**
 * ${name}
 * 
 * Authorization policy for ${model}
 */

export interface User {
  id: number;
  role?: string;
  // Add more user properties as needed
}

export class ${name} {
  /**
   * Determine if the user can view any ${model}s
   */
  viewAny(user: User): boolean {
    return true;
  }

  /**
   * Determine if the user can view the ${model}
   */
  view(user: User, ${this.toCamelCase(model)}: any): boolean {
    return true;
  }

  /**
   * Determine if the user can create ${model}s
   */
  create(user: User): boolean {
    return true;
  }

  /**
   * Determine if the user can update the ${model}
   */
  update(user: User, ${this.toCamelCase(model)}: any): boolean {
    // Example: return user.id === ${this.toCamelCase(model)}.userId;
    return true;
  }

  /**
   * Determine if the user can delete the ${model}
   */
  delete(user: User, ${this.toCamelCase(model)}: any): boolean {
    // Example: return user.id === ${this.toCamelCase(model)}.userId;
    return true;
  }

  /**
   * Determine if the user can restore the ${model}
   */
  restore(user: User, ${this.toCamelCase(model)}: any): boolean {
    return this.delete(user, ${this.toCamelCase(model)});
  }

  /**
   * Determine if the user can permanently delete the ${model}
   */
  forceDelete(user: User, ${this.toCamelCase(model)}: any): boolean {
    return false; // Usually restricted to admins
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
