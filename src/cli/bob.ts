#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { MakeModelCommand } from '../commands/MakeModelCommand';
import { MakeControllerCommand } from '../commands/MakeControllerCommand';
import { MakeServiceCommand } from '../commands/MakeServiceCommand';
import { MakePolicyCommand } from '../commands/MakePolicyCommand';
import { MakeMigrationCommand } from '../commands/MakeMigrationCommand';
import { MigrateCommand } from '../commands/MigrateCommand';
import { InitCommand } from '../commands/InitCommand';
import { MakeMiddlewareCommand } from '../commands/MakeMiddlewareCommand';
import { NewCommand } from '../commands/NewCommand';
import { DevCommand } from '../commands/DevCommand';
import { StartCommand } from '../commands/StartCommand';
import { UpdateCommand } from '../commands/UpdateCommand';

const program = new Command();

console.log(chalk.cyan.bold(`
╔══════════════════════════════════════╗
║                                      ║
║   🔨 Bob - The Builder for Next.js  ║
║   Laravel-style CLI for Next.js      ║
║                                      ║
╚══════════════════════════════════════╝
`));

program
    .name('bob')
    .description('Bob builds things - A Laravel-inspired CLI for Next.js')
    .version('1.0.5');

// Initialize command
program
    .command('init')
    .description('Initialize a new Nextlara project')
    .action(async () => {
        await new InitCommand().handle();
    });

// New command
program
    .command('new <name>')
    .description('Create a new Nextlara project')
    .action(async (name) => {
        await new NewCommand().handle(name);
    });

// Dev command
program
    .command('dev')
    .description('Start the development server')
    .action(async () => {
        await new DevCommand().handle();
    });

// Start command
program
    .command('start')
    .description('Start the production server')
    .action(async () => {
        await new StartCommand().handle();
    });

// Make commands
program
    .command('make:model <name>')
    .description('Create a new model')
    .option('-m, --migration', 'Create a migration for the model')
    .action(async (name, options) => {
        await new MakeModelCommand().handle(name, options);
    });

program
    .command('make:controller <name>')
    .description('Create a new controller')
    .option('-r, --resource', 'Create a resource controller')
    .action(async (name, options) => {
        await new MakeControllerCommand().handle(name, options);
    });

program
    .command('make:service <name>')
    .description('Create a new service')
    .action(async (name) => {
        await new MakeServiceCommand().handle(name);
    });

program
    .command('make:policy <name>')
    .description('Create a new policy')
    .option('-m, --model <model>', 'The model the policy applies to')
    .action(async (name, options) => {
        await new MakePolicyCommand().handle(name, options);
    });

program
    .command('make:migration <name>')
    .description('Create a new migration')
    .action(async (name) => {
        await new MakeMigrationCommand().handle(name);
    });

program
    .command('make:middleware <name>')
    .description('Create a new middleware')
    .action(async (name) => {
        await new MakeMiddlewareCommand().handle(name);
    });

// Migration commands
program
    .command('migrate')
    .description('Run database migrations')
    .option('--fresh', 'Drop all tables and re-run all migrations')
    .action(async (options) => {
        await new MigrateCommand().handle(options);
    });

// Update command
program
    .command('update')
    .description('Update the global Nextlara CLI to the latest version')
    .action(async () => {
        await new UpdateCommand().handle();
    });

program.parse(process.argv);
