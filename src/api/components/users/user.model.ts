export interface User {
  _id: number;
  password: string;
  name: string;
  bio: string;
  email: string;
  accessToken: string;
  createdAt: Date;
  updatedAt: Date;
}
