import { model, Model } from "mongoose";
import { IUserDocument, UserSchema } from "./users.schema";

export interface User {
	id: string;
	password: string;
	name: string;
	bio: string;
	email: string;
	accessToken: string;
	createdAt: Date;
	updatedAt: Date;
}

interface IUserModel extends Model<IUserDocument> {
	findByToken(token: string): Promise<IUserDocument>;
	findByCredentials(email: string, password: string): Promise<IUserDocument>;
}

const UsersModel: IUserModel = model<IUserDocument, any>("Users", UserSchema);

export { UsersModel };
