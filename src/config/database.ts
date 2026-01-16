import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASS as string,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'mysql',
    logging: false,
    timezone: '-03:00',

    dialectOptions: {
      connectTimeout: 60000,
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
      dateStrings: true,
      typeCast: true,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000
    }
  }
);
