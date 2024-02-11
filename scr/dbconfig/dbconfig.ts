import { createConnection, Connection } from "mysql2/promise";

export const getConnection = async (): Promise<Connection> => {
  try {
    const connection = await createConnection({
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
  } catch (error: any) {
    console.error("Error getting a database connection:", error.message);
    throw error;
  }
};
