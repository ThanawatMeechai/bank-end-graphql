const { buildSchema } = require('graphql');

const schema = buildSchema(`
  input UserInput {
    email: String!
    name: String!
    username: String!
    password: String!
  }
  
  type User {
    id: Int!
    name: String!
    email: String!
    username: String!
    password: String!  # Note: It's recommended not to return the password in a production environment
  }
  
  type AuthPayload {
    token: String
    user: User
  }
  
  type Mutation {
    createUser(input: UserInput): User
    updateUser(id: Int!, input: UserInput): User
    createRandomUsers: [User]
    loginUser(username: String!, password: String!): AuthPayload
  }
  
  type Query {
    getUser(id: Int!): User
    getUsers: [User]
    getEmailIndexStatus: String
    getUsersByEmail(email: String!): [User]
  }
`);

export default schema;
