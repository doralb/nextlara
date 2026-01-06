import chalk from 'chalk';
import ora from 'ora';
import { execSync } from 'child_process';

export class UpdateCommand {
    async handle() {
        const spinner = ora('Updating Nextlara global CLI...').start();

        try {
            // Run the global installation command
            execSync('npm install -g nextlara@latest', { stdio: 'ignore' });

            spinner.succeed(chalk.green('Nextlara global CLI updated successfully to the latest version!'));
            console.log(chalk.cyan('\nRun "nextlara --version" to verify.'));
        } catch (error) {
            spinner.fail(chalk.red('Failed to update Nextlara global CLI.'));
            console.log(chalk.yellow('\nTry running the command with administrator privileges:'));
            console.log(chalk.white('npm install -g nextlara@latest'));
        }
    }
}
