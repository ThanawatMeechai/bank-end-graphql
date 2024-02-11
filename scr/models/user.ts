export type UserInputL = Pick<User, "password" | "username">;


export type User = {
  id: number;
  name: string;
  email: string;
  username: string;
  password: string;
};

export type AuthPayload = {
  token: string;
  user: User;
};


export type UserInput = Pick<User, "email" | "name"|"password"|"username">;
