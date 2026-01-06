export const PackageJsonTemplate = (name: string, starter: string) => {
    const dependencies: any = {
        next: "canary",
        react: "^19.0.0",
        "react-dom": "^19.0.0",
        "@prisma/client": "latest"
    };

    const devDependencies: any = {
        "@types/node": "^20.0.0",
        "@types/react": "^19.0.0",
        "@types/react-dom": "^19.0.0",
        typescript: "^5.0.0",
        eslint: "^9.0.0",
        "eslint-config-next": "canary",
        "prisma": "latest",
        "tailwindcss": "latest",
        "postcss": "latest",
        "autoprefixer": "latest"
    };

    if (starter === 'auth') {
        dependencies["lucide-react"] = "latest";
        dependencies["framer-motion"] = "latest";
        dependencies["clsx"] = "latest";
        dependencies["tailwind-merge"] = "latest";
    }

    return JSON.stringify({
        name,
        version: "1.0.0",
        scripts: {
            dev: "next dev",
            build: "next build",
            start: "next start",
            lint: "next lint"
        },
        dependencies,
        devDependencies
    }, null, 2);
};

export const TsConfigTemplate = JSON.stringify({
    compilerOptions: {
        lib: ["dom", "dom.iterable", "esnext"],
        allowJs: true,
        skipLibCheck: true,
        strict: false,
        noEmit: true,
        esModuleInterop: true,
        module: "esnext",
        moduleResolution: "bundler",
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: "preserve",
        incremental: true,
        plugins: [{ name: "next" }],
        paths: { "@/*": ["./*"] }
    },
    include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
    exclude: ["node_modules"]
}, null, 2);

export const NextConfigTemplate = `/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig
`;

export const EslintConfigTemplate = JSON.stringify({
    extends: "next/core-web-vitals"
}, null, 2);

export const GitignoreTemplate = `# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
`;
