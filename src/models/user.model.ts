export interface User {
  _id: number;
  password: string;
  name: string;
  bio: string;
  email: string;
  tokens: {
    access: string;
    token: string;
  }[];
}
