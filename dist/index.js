"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// app.ts
const express_1 = __importDefault(require("express"));
const express_graphql_1 = require("express-graphql");
const schema_1 = __importDefault(require("./graphql/schema"));
const schemaInit_1 = __importDefault(require("./schemaInit"));
const Route_1 = require("./route/Route");
const startServer = async () => {
    await (0, schemaInit_1.default)();
    const app = (0, express_1.default)();
    const createGraphQLMiddleware = (rootValue) => {
        return (0, express_graphql_1.graphqlHTTP)({
            schema: schema_1.default,
            rootValue,
            graphiql: true,
        });
    };
    app.use("/graphql", createGraphQLMiddleware(Route_1.Route_user));
    app.use("/api/store", createGraphQLMiddleware(Route_1.Route_store));
    const PORT = 8000;
    app.listen(PORT, () => {
        console.log(`Running a GraphQL API server at http://localhost:${PORT}/graphql`);
    });
};
startServer();
