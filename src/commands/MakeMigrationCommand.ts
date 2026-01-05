import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';

export class MakeMigrationCommand {
    async handle(name: string) {
        const spinner = ora(`Creating migration ${name}...`).start();

        try {
            const cwd = process.cwd();
            const timestamp = new Date().getTime();
            const migrationName = `${timestamp}_${name}`;
            const migrationPath = path.join(cwd, 'database/migrations', `${migrationName}.ts`);

            // Check if migration already exists
            if (await fs.pathExists(migrationPath)) {
                spinner.fail(chalk.red(`Migration ${name} already exists!`));
                return;
            }

            // Generate migration content
            const migrationContent = this.generateMigrationContent(name, migrationName);
            await fs.writeFile(migrationPath, migrationContent);

            spinner.succeed(chalk.green(`Migration ${migrationName} created successfully!`));
            console.log(chalk.cyan(`Location: ${migrationPath}`));
            console.log(chalk.yellow('\nNext steps:'));
            console.log(chalk.white('  1. Edit the migration file to define your schema'));
            console.log(chalk.white('  2. Run: npx bob migrate'));
        } catch (error) {
            spinner.fail(chalk.red(`Failed to create migration ${name}`));
            console.error(error);
        }
    }

    private generateMigrationContent(name: string, migrationName: string): string {
        const isCreateTable = name.startsWith('create_') && name.endsWith('_table');

        if (isCreateTable) {
            const tableName = name.replace('create_', '').replace('_table', '');

            return `/**
 * Migration: ${migrationName}
 * 
 * Add this to your Prisma schema (prisma/schema.prisma):
 */

/*
model ${this.toPascalCase(tableName)} {
  id        Int      @id @default(autoincrement())
  // Add your fields here
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
*/

export default {
  name: '${migrationName}',
  
  /**
   * Run the migration
   * After adding the model to your schema, run: npx prisma migrate dev --name ${name}
   */
  async up() {
    console.log('Running migration: ${migrationName}');
    // Migration is handled by Prisma
  },
  
  /**
   * Reverse the migration
   */
  async down() {
    console.log('Rolling back migration: ${migrationName}');
    // Rollback is handled by Prisma
  },
};
`;
        }

        return `/**
 * Migration: ${migrationName}
 */

export default {
  name: '${migrationName}',
  
  /**
   * Run the migration
   */
  async up() {
    console.log('Running migration: ${migrationName}');
    // Add your migration logic here
    // You can use Prisma's $executeRaw for custom SQL
  },
  
  /**
   * Reverse the migration
   */
  async down() {
    console.log('Rolling back migration: ${migrationName}');
    // Add your rollback logic here
  },
};
`;
    }

    private toPascalCase(str: string): string {
        return str
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join('');
    }
}
