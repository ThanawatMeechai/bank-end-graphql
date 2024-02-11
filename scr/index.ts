// app.ts
import express, { Express } from "express";
import { graphqlHTTP } from "express-graphql";
import schema from "./graphql/schema";
import * as userService from "./services/userService";
import initializeSchema from "./schemaInit";
import  * as authUserService_Register from "./services/auth/authUserService";


const startServer = async () => {
  await initializeSchema();





  const root = {
    getUser: userService.getUser,
    getUsers: userService.getUsers,
    createUser: authUserService_Register.createUser,
    updateUser: userService.updateUser,
    createRandomUsers:userService.createRandomUsers,
    loginUser:authUserService_Register.loginUser
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
