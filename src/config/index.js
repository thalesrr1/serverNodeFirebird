import dotenv from "dotenv";

dotenv.config();

export const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3050", 10),
  username: process.env.DB_USER || "SYSDBA",
  password: process.env.DB_PASSWORD || "masterkey",
  database: process.env.DB_DATABASE || "C:/path/to/your/database.fdb",
};

export const serverConfig = {
  port: parseInt(process.env.SERVER_PORT || "3000", 10),
};
