"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { buildSchema } = require('graphql');
const schema = buildSchema(`
  input UserInput {
    email: String!
    name: String!
    username: String!
    password: String!
  }
  input UserInputL {
    username: String!
    password: String!
  }
  
  type User {
    id: Int!
    name: String!
    email: String!
    username: String!
    password: String!  
  }

  
  type AuthPayload {
    token: String
    user: User
  }
  
  type Mutation {
    createUser(input: UserInput): User
    updateUser(id: Int!, input: UserInput): User
    createRandomUsers: [User]
    loginUser(input: UserInputL): User
  }
  
  type Query {
    getUser(id: Int!): User
    getUsers: [User]
    getEmailIndexStatus: String
    getUsersByEmail(email: String!): [User]
  }
`);
exports.default = schema;
