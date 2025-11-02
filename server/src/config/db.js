import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Explicitly specify path to your .env
dotenv.config({ path: "./.env" });

// Debug: check if variables are loaded
console.log("DB_USER =", process.env.DB_USER);
console.log("DB_PASS =", process.env.DB_PASS);
console.log("DB_NAME =", process.env.DB_NAME);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: 3306,
    logging: false,
  }
);

export default sequelize;
