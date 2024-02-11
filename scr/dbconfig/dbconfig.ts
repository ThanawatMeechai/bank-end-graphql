import mysql from "mysql2/promise";

const createConnection = async () => {
  try {
    const connection = await mysql.createConnection({
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
    console.error("Error connecting to the database:", error.message);
    throw error;
  }
};

export default createConnection;