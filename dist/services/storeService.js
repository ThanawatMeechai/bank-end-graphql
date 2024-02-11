"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStore = exports.getStore = void 0;
const dbconfig_1 = require("../dbconfig/dbconfig");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getStore = async (args, token) => {
    try {
        // ตรวจสอบ token
        const decoded = jsonwebtoken_1.default.verify(token, 'testtest');
        // ถ้า token ถูกต้อง, ดำเนินการดึงข้อมูล store
        const connection = await (0, dbconfig_1.getConnection)();
        const [rows] = await connection.execute("SELECT * FROM store WHERE id = ?", [args.id]);
        return rows[0];
    }
    catch (error) {
        console.error("Error in getStore:", error);
        throw new Error("Invalid token or unauthorized access");
    }
};
exports.getStore = getStore;
const createStore = async (args) => {
    const { name, price, image } = args.input;
    const connection = await (0, dbconfig_1.getConnection)();
    try {
        // Hash the password
        //   console.log("register_username:", username);
        //   console.log("register_password:", password);
        const [existingUser] = await connection.execute("SELECT * FROM store WHERE name = ?", [name]);
        if (existingUser.length > 0) {
            throw new Error("name store already in use");
        }
        const [result] = await connection.execute("INSERT INTO store (name, price, image) VALUES (?, ?, ?)", [name, price, image]);
        const [rows] = await connection.execute("SELECT * FROM store WHERE id = ?", [result.insertId]);
        return rows[0];
    }
    catch (error) {
        console.error("Error in createStore:", error);
        throw new Error("Store creation failed. Please try again.");
    }
    finally {
        await connection.end();
    }
};
exports.createStore = createStore;
