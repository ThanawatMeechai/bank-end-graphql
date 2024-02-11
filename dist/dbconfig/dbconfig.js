"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnection = void 0;
const promise_1 = require("mysql2/promise");
const getConnection = async () => {
    try {
        const connection = await (0, promise_1.createConnection)({
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
        console.error("Error getting a database connection:", error.message);
        throw error;
    }
};
exports.getConnection = getConnection;
