const { buildSchema } = require("graphql");

const schema = buildSchema(`
# Input Types
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

input StoreInput {
  name: String!
  price: String!
  image: String!
}

# Object Types
type User {
  id: Int!
  name: String!
  email: String!
  username: String!
  password: String!
}

type Store {
  name: String!
  price: String!
  image: String!
}

type AuthPayload {
  token: String
  user: User
}

# Mutations
type Mutation {
  # User Mutations
  createUser(input: UserInput): User
  updateUser(id: Int!, input: UserInput): User
  createRandomUsers: [User]
  loginUser(input: UserInputL): AuthPayload 

  # Store Mutation
  createStore(input: StoreInput): Store
}

# Queries
type Query {
  getUser(id: Int!): User
  getUsers: [User]
  getEmailIndexStatus: String
  getUsersByEmail(email: String!): [User]

  # Store Query
  getStore(id: Int!, accessToken: String!): Store
}

`);

export default schema;
