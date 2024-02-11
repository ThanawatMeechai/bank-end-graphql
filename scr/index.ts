// app.ts
import express, { Express, Request } from "express";
import { graphqlHTTP } from "express-graphql";
import schema from "./graphql/schema";
import initializeSchema from "./schemaInit";
import { Route_store, Route_user } from "./route/Route";


const startServer = async () => {
  await initializeSchema();
  const app: Express = express();

 const createGraphQLMiddleware = (rootValue:any) => {
  return graphqlHTTP({
    schema,
    rootValue,
    graphiql: true,
  });
};

app.use("/graphql", createGraphQLMiddleware(Route_user));
app.use("/api/store", createGraphQLMiddleware(Route_store));

  const PORT = 8000;

  app.listen(PORT, () => {
    console.log(
      `Running a GraphQL API server at http://localhost:${PORT}/graphql`
    );
  });
};

startServer();
