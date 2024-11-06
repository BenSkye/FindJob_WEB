const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 2024,
  },
  db: {
    user: process.env.DEV_DB_USER || 'MerciDev',
    password: process.env.DEV_DB_PASSWORD || 'MerciDev',
    host: process.env.DEV_DB_HOST || 'cluster0.akvzr.mongodb.net',
    name: process.env.DEV_DB_NAME || 'bakery_marketplace_dev',
  },
};

const pro = {
  app: {
    port: process.env.PRO_APP_PORT || 3000,
  },
  db: {
    user: process.env.PRO_DB_USER || 'MerciDev',
    password: process.env.PRO_DB_PASSWORD || 'MerciDev',
    host: process.env.PRO_DB_HOST || 'cluster0.akvzr.mongodb.net',
    name: process.env.PRO_DB_NAME || 'bakery_marketplace_pro',
  },
};
const config = { dev, pro } as { [key: string]: any };
const env = process.env.NODE_ENV || 'dev';
export default config[env];
