import { User, UserInput } from "../../models/user";
import { OkPacket, RowDataPacket, Connection } from "mysql2/promise";
import createConnection from "../../dbconfig/dbconfig";
import bcrypt from 'bcrypt';

export const createUser = async (args: { input: UserInput }): Promise<User> => {
    const { name, email, password, username } = args.input;
    const conn: Connection = await createConnection();

    try {

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the saltRounds

    const conn: Connection = await createConnection();

    // Check if the username already exists
    const [existingUser] = await conn.execute<RowDataPacket[]>(
        "SELECT * FROM users WHERE username = ?",
        [username]
    );

    if (existingUser.length > 0) {
        // Username is already in use, handle accordingly (throw an error, return an error response, etc.)
        throw new Error("Username already in use");
    }

    // Insert the new user
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
    throw new Error("User creation failed. Please try again."); // You can customize this error message
} finally {
    // Close the database connection in the finally block to ensure it's always closed
    await conn.end();
}
};


export const loginUser = async (username: string, password: string): Promise<User | null> => {
    const conn: Connection = await createConnection();

    // Retrieve user by username
    const [existingUser] = await conn.execute<RowDataPacket[]>(
        "SELECT * FROM users WHERE username = ?",
        [username]
    );

    if (existingUser.length === 0) {
        // Username not found, return null or handle accordingly
        return null;
    }

    const user: User = existingUser[0] as User;

    // Check if the provided password matches the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log(await bcrypt.compare(password, user.password));
    

    if (!passwordMatch) {
        // Password does not match, return null or handle accordingly
        return null;
    }

    // Password matches, return the user
    return user;
};

