const dev = {
  NODE_ENV: 'development',
  APP_URL: 'http://gobarber-api:3333',
  APP_SECRET: 'e30772000ddd66f82fbb7ce2ec5787e4',
  DB_HOST: 'gobarber-postgres',
  DB_USER: 'postgres',
  DB_PASS: '123456',
  DB_NAME: 'gobarber',
  MONGO_URL: 'mongodb://gobarber-mongo:27017/gobarber',
  REDIS_HOST: 'gobarber-redis',
  REDIS_PORT: '6379',
  MAIL_HOST: 'smtp.mailtrap.io',
  MAIL_PORT: '465',
  MAIL_USER: '08eb0cb1933ac1',
  MAIL_PASS: '0083d57f2e4b11',
};

module.exports = {
  apps: [
    {
      name: 'GoBarberApp',
      script: 'dist/server.js',
      instances: '2',
      env: dev,
      env_production: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'GoBarberQueue',
      script: 'dist/queue.js',
      instances: '1',
      env: dev,
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
