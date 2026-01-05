import { spawn } from 'child_process';
import chalk from 'chalk';

export class StartCommand {
    async handle() {
        console.log(chalk.cyan('\n🚀 Starting Nextlara production server...\n'));

        const child = spawn('npm', ['run', 'start'], {
            stdio: 'inherit',
            shell: true
        });

        child.on('error', (err) => {
            console.error(chalk.red('Failed to start production server:'), err);
        });
    }
}
