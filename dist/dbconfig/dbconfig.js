"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const createConnection = async () => {
    try {
        const connection = await promise_1.default.createConnection({
            host: "127.0.0.1",
            user: "root",
            password: "root",
            database: "dbtest",
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });
        console.log("Connected to the database");
        return connection;
    }
    catch (error) {
        console.error("Error connecting to the database:", error.message);
        throw error;
    }
};
exports.default = createConnection;
