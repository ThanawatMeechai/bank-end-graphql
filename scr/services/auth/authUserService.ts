import { AuthPayload, User, UserInput, UserInputL } from "../../models/user";
import { OkPacket, RowDataPacket, Connection } from "mysql2/promise";
import  {  getConnection } from "../../dbconfig/dbconfig";
import { sign } from 'jsonwebtoken';
import bcrypt from "bcrypt";

export const createUser = async (args: { input: UserInput }): Promise<User> => {
  const { name, email, password, username } = args.input;
  const conn: Connection = await getConnection();

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
}): Promise<AuthPayload | null> => {
  const { password, username } = args.input;
  const conn: Connection = await getConnection();

  try {
    const [existingUser] = await conn.execute<RowDataPacket[]>(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (!existingUser || existingUser.length === 0) {
      throw new Error("User not found. Please check your username.");
    }

    const user: UserInputL = existingUser[0] as UserInputL;
    console.log("user:",user);
    
    const storedHashedPassword = user.password;
    console.log("Stored hashed password:", storedHashedPassword);

    const passwordMatch = await bcrypt.compare(password, storedHashedPassword);
    if (!passwordMatch) {
      throw new Error("Invalid password. Please try again.");
    }

    const token = sign({ username: user.username }, 'testtest', {
      expiresIn: '1h',
    });

    console.log("token:", token);

    const authPayload: AuthPayload = {
      token: token,
      user: user as User,
    };

    return authPayload;
  } catch (error) {
    console.error("Error in loginUser:", error);
    throw new Error("Login failed. Please try again.");
  } finally {
    await conn.end();
  }
};

