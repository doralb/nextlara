import { spawn } from 'child_process';
import chalk from 'chalk';

export class DevCommand {
    async handle() {
        console.log(chalk.cyan('\n🚀 Starting Nextlara development server...\n'));

        const child = spawn('npm', ['run', 'dev'], {
            stdio: 'inherit',
            shell: true
        });

        child.on('error', (err) => {
            console.error(chalk.red('Failed to start development server:'), err);
        });
    }
}
