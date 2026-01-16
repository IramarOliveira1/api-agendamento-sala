import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASS as string,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT as any,
    logging: false,
    timezone: '-03:00',
    dialectOptions: {
      dateStrings: true, // Força o banco a retornar datas como strings
      typeCast: true,    // Mantém o fuso horário ao ler do banco
    },
  }
);