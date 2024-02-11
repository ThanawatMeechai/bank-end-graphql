"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRandomUsers = exports.updateUser = exports.getUsers = exports.getUser = void 0;
const dbconfig_1 = __importDefault(require("../dbconfig/dbconfig"));
const getUser = async (args) => {
    const conn = await (0, dbconfig_1.default)();
    const [rows] = await conn.execute("SELECT * FROM users WHERE id = ?", [args.id]);
    return rows[0];
};
exports.getUser = getUser;
const getUsers = async () => {
    const conn = await (0, dbconfig_1.default)();
    const [rows] = await conn.execute("SELECT * FROM users");
    return rows;
};
exports.getUsers = getUsers;
const updateUser = async (args) => {
    const conn = await (0, dbconfig_1.default)();
    const { id, ...userInput } = args.user;
    await conn.execute("UPDATE users SET name = ?, email = ? WHERE id = ?", [
        userInput.name,
        userInput.email,
        id,
    ]);
    const [rows] = await conn.execute("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0];
};
exports.updateUser = updateUser;
const createRandomUsers = async () => {
    const users = [];
    const batchSize = 100; // ปรับขนาดของ Batch ตามความเหมาะสม
    // สร้างการเชื่อมต่อเดียวกับฐานข้อมูล
    const conn = await (0, dbconfig_1.default)();
    try {
        // เปิดการใช้งาน Transaction
        await conn.beginTransaction();
        for (let i = 0; i < 100000; i += batchSize) {
            const batchUsers = [];
            // สร้างข้อมูลใน Batch
            for (let j = 0; j < batchSize; j++) {
                const randomName = generateRandomName();
                const randomEmail = generateRandomEmail();
                batchUsers.push({ name: randomName, email: randomEmail });
            }
            // ทำการ INSERT ข้อมูลทั้ง Batch
            await conn.query("INSERT INTO users (name, email) VALUES ?", [batchUsers.map((user) => [user.name, user.email])]);
            // ดึงข้อมูลผู้ใช้ที่ถูกสร้างใน Batch
            const [rows] = await conn.query("SELECT * FROM users WHERE id >= LAST_INSERT_ID() - ?", [
                batchSize,
            ]);
            users.push(...rows.map(row => ({ id: row.id, name: row.name, email: row.email })));
        }
        // Commit การใช้งาน Transaction
        await conn.commit();
    }
    catch (error) {
        // Rollback ในกรณีเกิดข้อผิดพลาด
        await conn.rollback();
        console.error("Error creating users:", error);
    }
    finally {
        // ปิดการเชื่อมต่อหลังจากใช้งาน
        await conn.end();
    }
    return users;
};
exports.createRandomUsers = createRandomUsers;
const generateRandomName = () => {
    const firstNames = ["John", "Jane", "Mike", "Emily", "Alex", "Sophia"];
    const lastNames = ["Doe", "Smith", "Johnson", "Williams", "Brown", "Jones"];
    const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${randomFirstName} ${randomLastName}`;
};
const generateRandomEmail = () => {
    const emailProviders = ["gmail.com", "yahoo.com", "hotmail.com", "example.com"];
    const randomName = generateRandomName().toLowerCase().replace(" ", ".");
    const randomProvider = emailProviders[Math.floor(Math.random() * emailProviders.length)];
    return `${randomName}@${randomProvider}`;
};
