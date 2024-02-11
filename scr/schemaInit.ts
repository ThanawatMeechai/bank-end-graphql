import createConnection from "./dbconfig/dbconfig";

const initializeSchema = async () => {
  const connection = await createConnection();

  // Initialize MySQL table if needed
  await connection.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
  );
  
  `);
  
  // Create indexes
  // await connection.query(`CREATE INDEX idx_users_email ON users (email)`);

  console.log("Schema initialized");
};

export default initializeSchema;
