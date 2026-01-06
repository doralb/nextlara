import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';

// Import Templates
import { EnvExampleTemplate, AppConfigTemplate } from '../templates/layout';
import { BaseModelTemplate, BaseControllerTemplate, ContainerTemplate, BaseMiddlewareTemplate } from '../templates/base';
import { PrismaSchemaTemplate } from '../templates/database';
import { ApiRoutesTemplate, WebRoutesTemplate, CatchAllApiRouteTemplate, CatchAllWebPageTemplate } from '../templates/routing';
import {
  PackageJsonTemplate,
  TsConfigTemplate,
  NextConfigTemplate,
  EslintConfigTemplate,
  GitignoreTemplate
} from '../templates/config';
import {
  WelcomeTemplate
} from '../templates/views/welcome';
import {
  AppLayoutTemplate,
  RootLayoutTemplate
} from '../templates/layout';
import {
  AuthControllerTemplate,
  AuthMiddlewareTemplate,
  UserModelTemplate,
  UserPolicyTemplate
} from '../templates/app/auth';
import {
  LoginViewTemplate,
  RegisterViewTemplate
} from '../templates/views/auth';
import {
  DashboardViewTemplate
} from '../templates/views/dashboard';
import {
  PrismaClientTemplate,
  TailwindConfigTemplate,
  GlobalsCssTemplate
} from '../templates/common';

export class InitCommand {
  private starter: string = 'basic';

  async handle() {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'starter',
        message: 'Which starter kit would you like to use?',
        choices: [
          { name: 'Basic (Routing + CLI)', value: 'basic' },
          { name: 'SaaS Starter Kit (Auth + Dashboard + Prisma)', value: 'auth' }
        ],
        default: 'basic'
      }
    ]);

    this.starter = answers.starter;
    const spinner = ora('Initializing Nextlara project...').start();

    try {
      const cwd = process.cwd();
      const directories = [
        'app/models', 'app/controllers', 'app/services', 'app/policies',
        'app/middleware', 'app/validators', 'database/migrations',
        'database/seeders', 'config', 'routes', 'lib/nextlara'
      ];

      for (const dir of directories) {
        await fs.ensureDir(path.join(cwd, dir));
      }

      await this.createConfigFiles(cwd);
      await this.createBaseClasses(cwd);
      await this.initializePrisma(cwd);
      await this.createRouteFiles(cwd);

      if (this.starter === 'auth') {
        await this.createAuthScaffolding(cwd);
      }

      await this.createNextJsConfig(cwd);

      spinner.succeed(chalk.green('Nextlara project initialized successfully!'));
      console.log(chalk.cyan('\nNext steps:'));
      console.log(chalk.white('  1. Run: npm install --legacy-peer-deps'));
      console.log(chalk.white('  2. Configure your database in .env'));
      console.log(chalk.white('  3. Run: bob dev'));
      console.log(chalk.white('\nHappy building! 🚀'));
    } catch (error) {
      spinner.fail(chalk.red('Failed to initialize project'));
      console.error(error);
    }
  }

  private async createConfigFiles(cwd: string) {
    await fs.writeFile(path.join(cwd, '.env.example'), EnvExampleTemplate);
    await fs.writeFile(path.join(cwd, 'config/app.ts'), AppConfigTemplate);
  }

  private async createBaseClasses(cwd: string) {
    await fs.writeFile(path.join(cwd, 'lib/nextlara/Model.ts'), BaseModelTemplate);
    await fs.writeFile(path.join(cwd, 'lib/nextlara/Controller.ts'), BaseControllerTemplate);
    await fs.writeFile(path.join(cwd, 'lib/nextlara/Container.ts'), ContainerTemplate);
    await fs.writeFile(path.join(cwd, 'lib/nextlara/Middleware.ts'), BaseMiddlewareTemplate);

    const packageRoot = path.join(__dirname, '../../');
    const filesToCopy = ['Router.ts', 'RouteHandler.ts'];

    for (const file of filesToCopy) {
      let srcPath = path.join(packageRoot, 'src/lib/nextlara', file);
      if (!await fs.pathExists(srcPath)) {
        srcPath = path.join(__dirname, '../../src/lib/nextlara', file);
      }
      const content = await fs.readFile(srcPath, 'utf-8');
      await fs.writeFile(path.join(cwd, 'lib/nextlara', file), content);
    }

    await fs.writeFile(path.join(cwd, 'lib/prisma.ts'), PrismaClientTemplate);
  }

  private async initializePrisma(cwd: string) {
    await fs.ensureDir(path.join(cwd, 'prisma'));
    await fs.writeFile(path.join(cwd, 'prisma/schema.prisma'), PrismaSchemaTemplate(this.starter));
  }

  private async createRouteFiles(cwd: string) {
    await fs.writeFile(path.join(cwd, 'routes/api.ts'), ApiRoutesTemplate(this.starter));
    await fs.writeFile(path.join(cwd, 'routes/web.ts'), WebRoutesTemplate(this.starter));

    await fs.ensureDir(path.join(cwd, 'app/api/[...slug]'));
    await fs.writeFile(path.join(cwd, 'app/api/[...slug]/route.ts'), CatchAllApiRouteTemplate);
  }

  private async createNextJsConfig(cwd: string) {
    const name = path.basename(cwd);
    await fs.writeFile(path.join(cwd, 'package.json'), PackageJsonTemplate(name, this.starter));
    await fs.writeFile(path.join(cwd, 'tsconfig.json'), TsConfigTemplate);
    await fs.writeFile(path.join(cwd, 'next.config.js'), NextConfigTemplate);
    await fs.writeFile(path.join(cwd, '.eslintrc.json'), EslintConfigTemplate);
    await fs.writeFile(path.join(cwd, 'tailwind.config.ts'), TailwindConfigTemplate);
    await fs.writeFile(path.join(cwd, 'postcss.config.js'), 'module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };');
    await fs.writeFile(path.join(cwd, 'app/globals.css'), GlobalsCssTemplate);

    await fs.ensureDir(path.join(cwd, 'resources/views/layouts'));
    await fs.writeFile(path.join(cwd, 'resources/views/welcome.tsx'), WelcomeTemplate(this.starter));
    await fs.writeFile(path.join(cwd, 'resources/views/layouts/app.tsx'), AppLayoutTemplate);
    await fs.writeFile(path.join(cwd, 'app/layout.tsx'), RootLayoutTemplate);

    await fs.ensureDir(path.join(cwd, 'app/[[...slug]]'));
    await fs.writeFile(path.join(cwd, 'app/[[...slug]]/page.tsx'), CatchAllWebPageTemplate);
    await fs.writeFile(path.join(cwd, '.gitignore'), GitignoreTemplate);
  }

  private async createAuthScaffolding(cwd: string) {
    await fs.writeFile(path.join(cwd, 'app/models/User.ts'), UserModelTemplate);
    await fs.writeFile(path.join(cwd, 'app/policies/UserPolicy.ts'), UserPolicyTemplate);
    await fs.writeFile(path.join(cwd, 'app/controllers/AuthController.ts'), AuthControllerTemplate);
    await fs.writeFile(path.join(cwd, 'app/middleware/AuthMiddleware.ts'), AuthMiddlewareTemplate);

    await fs.ensureDir(path.join(cwd, 'resources/views/auth'));
    await fs.writeFile(path.join(cwd, 'resources/views/auth/login.tsx'), LoginViewTemplate);
    await fs.writeFile(path.join(cwd, 'resources/views/auth/register.tsx'), RegisterViewTemplate);
    await fs.writeFile(path.join(cwd, 'resources/views/dashboard.tsx'), DashboardViewTemplate);
  }
}
