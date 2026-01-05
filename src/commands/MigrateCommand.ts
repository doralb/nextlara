import chalk from 'chalk';
import ora from 'ora';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class MigrateCommand {
    async handle(options: any) {
        const spinner = ora('Running migrations...').start();

        try {
            if (options.fresh) {
                spinner.text = 'Resetting database...';
                await execAsync('npx prisma migrate reset --force');
            } else {
                spinner.text = 'Running migrations...';
                await execAsync('npx prisma migrate dev');
            }

            spinner.succeed(chalk.green('Migrations completed successfully!'));
        } catch (error: any) {
            spinner.fail(chalk.red('Migration failed'));
            console.error(chalk.red(error.message));

            if (error.message.includes('prisma')) {
                console.log(chalk.yellow('\nMake sure Prisma is installed and configured:'));
                console.log(chalk.white('  npm install prisma @prisma/client'));
                console.log(chalk.white('  npx prisma init'));
            }
        }
    }
}
