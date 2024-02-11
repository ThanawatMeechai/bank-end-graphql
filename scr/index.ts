// app.ts
import express, { Express } from "express";
import { graphqlHTTP } from "express-graphql";
import schema from "./graphql/schema";
import * as userService from "./services/userService";
import initializeSchema from "./schemaInit";
import  * as authUserService_Register from "./services/auth/authUserService";
import createConnection from "./dbconfig/dbconfig";
import { User, UserInputL } from "./models/user";

import {  UserInput } from "./models/user";
import { OkPacket, RowDataPacket,Connection  } from "mysql2/promise";

import bcrypt from 'bcrypt';

const startServer = async () => {
  await initializeSchema();

  const loginUser = async(args: { input: UserInputL }): Promise<User> => {
    const { password, username } = args.input;
    const conn: Connection = await createConnection();
    console.log('username = ',username);

    try {
      
        const [existingUser] = await conn.execute<RowDataPacket[]>(
            "SELECT * FROM users WHERE username = ?",
            [username]
        );

        if (!existingUser || existingUser.length === 0) {
            // User not found, throw an error
            console.log('User not found for username:', username);
            throw new Error("User not found. Please check your username.");
        }

        const user: User = existingUser[0] as User;
        console.log('Retrieved user:', user);

        // Check if the provided password matches the stored password
        const passwordMatch = password === user.password;
        console.log('Provided password:', password);
        console.log('Password match:', passwordMatch);

        if (!passwordMatch) {
            // Password does not match, throw an error
            console.log('Invalid password for username:', username);
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



  const root = {
    getUser: userService.getUser,
    getUsers: userService.getUsers,
    createUser: authUserService_Register.createUser,
    updateUser: userService.updateUser,
    createRandomUsers:userService.createRandomUsers,
    loginUser:loginUser
  };

  const app: Express = express();

  app.use(
    "/graphql",
    graphqlHTTP({
      schema,
      rootValue: root,
      graphiql: true,
    })
  );

  const PORT = 8000;

  app.listen(PORT, () => {
    console.log(
      `Running a GraphQL API server at http://localhost:${PORT}/graphql`
    );
  });
};

startServer();
