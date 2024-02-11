"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.createUser = void 0;
const dbconfig_1 = __importDefault(require("../../dbconfig/dbconfig"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const createUser = async (args) => {
    const { name, email, password, username } = args.input;
    const conn = await (0, dbconfig_1.default)();
    try {
        // Hash the password
        console.log("register_username:", username);
        console.log("register_password:", password);
        const hashedPassword = await bcrypt_1.default.hash(password, 10); // 10 is the saltRounds
        // Check if the username already exists
        const [existingUser] = await conn.execute("SELECT * FROM users WHERE username = ?", [username]);
        if (existingUser.length > 0) {
            // Username is already in use, handle accordingly (throw an error, return an error response, etc.)
            throw new Error("Username already in use");
        }
        // Insert the new user with the hashed password
        const [result] = await conn.execute("INSERT INTO users (name, email, password, username) VALUES (?, ?, ?, ?)", [name, email, hashedPassword, username]);
        const [rows] = await conn.execute("SELECT * FROM users WHERE id = ?", [result.insertId]);
        return rows[0];
    }
    catch (error) {
        console.error("Error in createUser:", error);
        throw new Error("User creation failed. Please try again.");
    }
    finally {
        // Close the database connection in the finally block to ensure it's always closed
        await conn.end();
    }
};
exports.createUser = createUser;
const loginUser = async (args) => {
    const { password, username } = args.input;
    const conn = await (0, dbconfig_1.default)();
    try {
        const [existingUser] = await conn.execute("SELECT * FROM users WHERE username = ?", [username]);
        if (!existingUser || existingUser.length === 0) {
            // User not found, throw an error
            // console.log("User not found for username:", username);
            throw new Error("User not found. Please check your username.");
        }
        const user = existingUser[0];
        const storedHashedPassword = user.password; // เก็บ password ที่ผ่านการ hash
        console.log("Stored hashed password:", storedHashedPassword);
        // console.log("Retrieved user:", user);
        // Check if the provided password matches the stored hashed password
        const passwordMatch = await bcrypt_1.default.compare(password, storedHashedPassword);
        if (!passwordMatch) {
            // Password does not match, throw an error
            // console.log("Invalid password for username:", username);
            throw new Error("Invalid password. Please try again.");
        }
        // Password matches, return the user
        return user;
    }
    catch (error) {
        console.error("Error in loginUser:", error);
        throw new Error("Login failed. Please try again.");
    }
    finally {
        await conn.end();
    }
};
exports.loginUser = loginUser;
