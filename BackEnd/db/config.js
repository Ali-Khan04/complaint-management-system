import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_SERVER,
    dialect: "mssql",
    dialectModule: require("tedious"),
    dialectOptions: {
      encrypt: process.env.DB_ENCRYPT === "true",
      trustServerCertificate: process.env.DB_TRUST_CERT === "true",
    },
    logging: false,
  }
);

export default sequelize;
