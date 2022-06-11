import { model, Model } from "mongoose";
import { IUserDocument, UserSchema } from "./users.schema";

export interface User {
	id: string;
	password: string;
	name: string;
	bio: string;
	email: string;
	avatar: string;
	accessToken: string;
	createdAt: Date;
	updatedAt: Date;
}

interface IUserModel extends Model<IUserDocument> {
	findByToken(token: string): Promise<IUserDocument>;
	findByCredentials(username: string, password: string): Promise<IUserDocument>;
}

const UsersModel: IUserModel = model<IUserDocument, IUserModel>("Users", UserSchema);

export { UsersModel };
