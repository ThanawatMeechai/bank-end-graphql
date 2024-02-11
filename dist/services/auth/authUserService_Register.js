"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const dbconfig_1 = __importDefault(require("../../dbconfig/dbconfig"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const createUser = async (args) => {
    const { name, email, password, username } = args.input;
    // Hash the password
    const hashedPassword = await bcrypt_1.default.hash(password, 10); // 10 is the saltRounds
    const conn = await (0, dbconfig_1.default)();
    // Check if the username already exists
    const [existingUser] = await conn.execute("SELECT * FROM users WHERE username = ?", [username]);
    if (existingUser.length > 0) {
        // Username is already in use, handle accordingly (throw an error, return an error response, etc.)
        throw new Error("Username already in use");
    }
    // Insert the new user
    const [result] = await conn.execute("INSERT INTO users (name, email, password, username) VALUES (?, ?, ?, ?)", [name, email, hashedPassword, username]);
    const [rows] = await conn.execute("SELECT * FROM users WHERE id = ?", [result.insertId]);
    return rows[0];
};
exports.createUser = createUser;
