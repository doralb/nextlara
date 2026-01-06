export const AppLayoutTemplate = `import React from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="nextlara-app">
      {children}
    </div>
  );
}
`;

export const RootLayoutTemplate = `import './globals.css';
import AppLayout from '@/resources/views/layouts/app';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="font-body antialiased">
        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  )
}
`;

export const EnvExampleTemplate = `# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

# App
APP_NAME="Nextlara App"
APP_ENV="development"
APP_URL="http://localhost:3000"

# JWT
JWT_SECRET="your-secret-key-here"
`;

export const AppConfigTemplate = `export const config = {
  app: {
    name: process.env.APP_NAME || 'Nextlara App',
    env: process.env.APP_ENV || 'development',
    url: process.env.APP_URL || 'http://localhost:3000',
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'change-me-in-production',
  },
};
`;
