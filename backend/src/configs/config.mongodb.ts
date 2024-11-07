const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 2024,
  },
  db: {
    user: process.env.DEV_DB_USER || 'FindJob',
    password: process.env.DEV_DB_PASSWORD || 'FindJob',
    host: process.env.DEV_DB_HOST || 'findjob.1bksh.mongodb.net',
    name: process.env.DEV_DB_NAME || 'findjob_dev',
  },
};

const pro = {
  app: {
    port: process.env.PRO_APP_PORT || 3000,
  },
  db: {
    user: process.env.PRO_DB_USER || 'FindJob',
    password: process.env.PRO_DB_PASSWORD || 'FindJob',
    host: process.env.PRO_DB_HOST || 'findjob.1bksh.mongodb.net',
    name: process.env.PRO_DB_NAME || 'findjob_pro',
  },
};
const config = { dev, pro } as { [key: string]: any };
const env = process.env.NODE_ENV || 'dev';
export default config[env];
