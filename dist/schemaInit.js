"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbconfig_1 = __importDefault(require("./dbconfig/dbconfig"));
const initializeSchema = async () => {
    const connection = await (0, dbconfig_1.default)();
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
    // Create indexes
    // await connection.query(`CREATE INDEX idx_users_email ON users (email)`);
    console.log("Schema initialized");
};
exports.default = initializeSchema;
