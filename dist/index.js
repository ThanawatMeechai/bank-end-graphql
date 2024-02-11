"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// app.ts
const express_1 = __importDefault(require("express"));
const express_graphql_1 = require("express-graphql");
const schema_1 = __importDefault(require("./graphql/schema"));
const userService = __importStar(require("./services/userService"));
const schemaInit_1 = __importDefault(require("./schemaInit"));
const authUserService_Register = __importStar(require("./services/auth/authUserService"));
const dbconfig_1 = __importDefault(require("./dbconfig/dbconfig"));
const startServer = async () => {
    await (0, schemaInit_1.default)();
    const loginUser = async (args) => {
        const { password, username } = args.input;
        const conn = await (0, dbconfig_1.default)();
        console.log('username = ', username);
        try {
            const [existingUser] = await conn.execute("SELECT * FROM users WHERE username = ?", [username]);
            if (!existingUser || existingUser.length === 0) {
                // User not found, throw an error
                console.log('User not found for username:', username);
                throw new Error("User not found. Please check your username.");
            }
            const user = existingUser[0];
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
        }
        catch (error) {
            console.error("Error in loginUser:", error);
            throw new Error("Login failed. Please try again.");
        }
        finally {
            await conn.end();
        }
    };
    const root = {
        getUser: userService.getUser,
        getUsers: userService.getUsers,
        createUser: authUserService_Register.createUser,
        updateUser: userService.updateUser,
        createRandomUsers: userService.createRandomUsers,
        loginUser: loginUser
    };
    const app = (0, express_1.default)();
    app.use("/graphql", (0, express_graphql_1.graphqlHTTP)({
        schema: schema_1.default,
        rootValue: root,
        graphiql: true,
    }));
    const PORT = 8000;
    app.listen(PORT, () => {
        console.log(`Running a GraphQL API server at http://localhost:${PORT}/graphql`);
    });
};
startServer();
