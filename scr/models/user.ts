export type User = {
  id: number;
  name: string;
  email: string;
  username:String;
  password:string;
};

export type UserInput = Pick<User, "email" | "name"|"password"|"username">;
export type UserInputL = Pick<User, "password"|"username">;