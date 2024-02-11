"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByUsernameOrEmail = exports.createUser = void 0;
const dbconfig_1 = require("./dbconfig/dbconfig");
const createUser = async (user) => {
    const connection = await (0, dbconfig_1.getConnection)();
    try {
        // Implement your logic to insert a new user into the database
        // Example: Insert user into the database
        const [result] = await connection.execute("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [user.username, user.email, user.password]);
        return result.insertId; // Use type assertion to access insertId
    }
    catch (error) {
        console.error("Error creating user:", error.message);
        throw error;
    }
    finally {
        if (connection && 'release' in connection) {
            connection.release(); // Release the connection back to the pool
        }
    }
};
exports.createUser = createUser;
const getUserByUsernameOrEmail = async (username, email) => {
    const connection = await (0, dbconfig_1.getConnection)();
    try {
        // Implement your logic to retrieve user by username or email from the database
        // Example: Retrieve user from the database
        const [rows] = await connection.execute("SELECT * FROM users WHERE username = ? OR email = ?", [username, email]);
        return rows.length > 0 ? rows[0] : null; // Return the user or null if not found
    }
    catch (error) {
        console.error("Error getting user by username or email:", error.message);
        throw error;
    }
    finally {
        connection.release(); // Release the connection back to the pool
    }
};
exports.getUserByUsernameOrEmail = getUserByUsernameOrEmail;
