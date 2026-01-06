import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import { InitCommand } from './InitCommand';

export class NewCommand {
    async handle(projectName: string) {
        const spinner = ora(`Creating new Nextlara project: ${projectName}...`).start();

        try {
            const targetDir = path.join(process.cwd(), projectName);

            // Check if directory already exists
            if (await fs.pathExists(targetDir)) {
                spinner.fail(chalk.red(`Directory ${projectName} already exists!`));
                return;
            }

            // Create project directory
            await fs.ensureDir(targetDir);

            // Change to project directory and initialize
            process.chdir(targetDir);

            spinner.stop();
            const initCommand = new InitCommand();
            await initCommand.handle();

            spinner.succeed(chalk.green(`Project ${projectName} created successfully!`));

            console.log(chalk.cyan('\n🎉 Your Nextlara project is ready!\n'));
            console.log(chalk.white('Next steps:'));
            console.log(chalk.white(`  1. cd ${projectName}`));
            console.log(chalk.white('  2. npm install --legacy-peer-deps'));
            console.log(chalk.white('  3. bob dev'));
            console.log(chalk.white('\nHappy building! 🚀'));
        } catch (error) {
            spinner.fail(chalk.red('Failed to create project'));
            console.error(error);
        }
    }
}
