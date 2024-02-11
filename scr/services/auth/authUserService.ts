import { User, UserInput, UserInputL } from "../../models/user";
import { OkPacket, RowDataPacket, Connection } from "mysql2/promise";
import createConnection from "../../dbconfig/dbconfig";
import bcrypt from "bcrypt";

export const createUser = async (args: { input: UserInput }): Promise<User> => {
  const { name, email, password, username } = args.input;
  const conn: Connection = await createConnection();

  try {
    // Hash the password
    console.log("register_username:", username);
    console.log("register_password:", password);

    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the saltRounds

    // Check if the username already exists
    const [existingUser] = await conn.execute<RowDataPacket[]>(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (existingUser.length > 0) {
      // Username is already in use, handle accordingly (throw an error, return an error response, etc.)
      throw new Error("Username already in use");
    }

    // Insert the new user with the hashed password
    const [result] = await conn.execute<OkPacket>(
      "INSERT INTO users (name, email, password, username) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, username]
    );

    const [rows] = await conn.execute<RowDataPacket[]>(
      "SELECT * FROM users WHERE id = ?",
      [result.insertId]
    );

    return rows[0] as User;
  } catch (error) {
    console.error("Error in createUser:", error);
    throw new Error("User creation failed. Please try again.");
  } finally {
    // Close the database connection in the finally block to ensure it's always closed
    await conn.end();
  }
};

export const loginUser = async (args: {
  input: UserInputL;
}): Promise<UserInputL | null> => {
  const { password, username } = args.input;
  const conn: Connection = await createConnection();

  try {
    const [existingUser] = await conn.execute<RowDataPacket[]>(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (!existingUser || existingUser.length === 0) {
      // User not found, throw an error
      // console.log("User not found for username:", username);
      throw new Error("User not found. Please check your username.");
    }

    const user: UserInputL = existingUser[0] as UserInputL;
    const storedHashedPassword = user.password; // เก็บ password ที่ผ่านการ hash
    console.log("Stored hashed password:", storedHashedPassword);
    // console.log("Retrieved user:", user);

    // Check if the provided password matches the stored hashed password
    const passwordMatch = await bcrypt.compare(password, storedHashedPassword);



    if (!passwordMatch) {
      // Password does not match, throw an error
      // console.log("Invalid password for username:", username);
      throw new Error("Invalid password. Please try again.");
    }

    // Password matches, return the user
    return user;
  } catch (error) {
    console.error("Error in loginUser:", error);
    throw new Error("Login failed. Please try again.");
  } finally {
    await conn.end();
  }
};
