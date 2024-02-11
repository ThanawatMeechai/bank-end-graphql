"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbconfig_1 = require("./dbconfig/dbconfig");
const initializeSchema = async () => {
    const connection = await (0, dbconfig_1.getConnection)();
    // Initialize MySQL table if needed
    await connection.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
  );
  
  `);
    await connection.query(`
  CREATE TABLE IF NOT EXISTS store (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price VARCHAR(255) NOT NULL,
    image VARCHAR(1024) NOT NULL
);

  `);
    // Create indexes
    // await connection.query(`CREATE INDEX idx_users_email ON users (email)`);
    console.log("Schema initialized");
};
exports.default = initializeSchema;
