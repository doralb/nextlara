export const config = {
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
