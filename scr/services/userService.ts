import { User, UserInput } from "../models/user";
import { OkPacket, RowDataPacket, Connection } from "mysql2/promise";
import createConnection from "../dbconfig/dbconfig";
import bcrypt from 'bcrypt';

export const getUser = async (args: {
  id: number;
}): Promise<User | undefined> => {
  const conn: Connection = await createConnection();
  const [rows] = await conn.execute<RowDataPacket[]>(
    "SELECT * FROM users WHERE id = ?",
    [args.id]
  );
  return rows[0] as User | undefined;
};

export const getUsers = async (): Promise<User[]> => {
  const conn: Connection = await createConnection();
  const [rows] = await conn.execute<RowDataPacket[]>("SELECT * FROM users");
  return rows as User[];
};



export const updateUser = async (args: {
  id: number;
  user: User;
}): Promise<User | undefined> => {
  const conn: Connection = await createConnection();
  const { id, ...userInput } = args.user;
  await conn.execute("UPDATE users SET name = ?, email = ? WHERE id = ?", [
    userInput.name,
    userInput.email,
    id,
  ]);

  const [rows] = await conn.execute<RowDataPacket[]>(
    "SELECT * FROM users WHERE id = ?",
    [id]
  );

  return rows[0] as User | undefined;
};

export const createRandomUsers = async (): Promise<User[]> => {
  const users: User[] = [];
  const batchSize = 100; // ปรับขนาดของ Batch ตามความเหมาะสม

  // สร้างการเชื่อมต่อเดียวกับฐานข้อมูล
  const conn: Connection = await createConnection();

  try {
    // เปิดการใช้งาน Transaction
    await conn.beginTransaction();

    for (let i = 0; i < 100000; i += batchSize) {
      const batchUsers: User[] = [];

      // สร้างข้อมูลใน Batch
      for (let j = 0; j < batchSize; j++) {
        const randomName = generateRandomName();
        const randomEmail = generateRandomEmail();

        batchUsers.push({ name: randomName, email: randomEmail } as User);
      }

      // ทำการ INSERT ข้อมูลทั้ง Batch
      await conn.query(
        "INSERT INTO users (name, email) VALUES ?",
        [batchUsers.map((user) => [user.name, user.email])],
      );

      // ดึงข้อมูลผู้ใช้ที่ถูกสร้างใน Batch
      const [rows] = await conn.query<RowDataPacket[]>("SELECT * FROM users WHERE id >= LAST_INSERT_ID() - ?", [
        batchSize,
      ]);

      users.push(...rows.map(row => ({ id: row.id, name: row.name, email: row.email } as User)));

    }

    // Commit การใช้งาน Transaction
    await conn.commit();
  } catch (error) {
    // Rollback ในกรณีเกิดข้อผิดพลาด
    await conn.rollback();
    console.error("Error creating users:", error);
  } finally {
    // ปิดการเชื่อมต่อหลังจากใช้งาน
    await conn.end();
  }

  return users;
};
  const generateRandomName = (): string => {
    const firstNames = ["John", "Jane", "Mike", "Emily", "Alex", "Sophia"];
    const lastNames = ["Doe", "Smith", "Johnson", "Williams", "Brown", "Jones"];
  
    const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
    return `${randomFirstName} ${randomLastName}`;
  };
  
  const generateRandomEmail = (): string => {
    const emailProviders = ["gmail.com", "yahoo.com", "hotmail.com", "example.com"];
  
    const randomName = generateRandomName().toLowerCase().replace(" ", ".");
    const randomProvider = emailProviders[Math.floor(Math.random() * emailProviders.length)];
  
    return `${randomName}@${randomProvider}`;
  };
