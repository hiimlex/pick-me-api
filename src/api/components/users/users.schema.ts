import * as jwt from "jsonwebtoken";
import { Document, Schema } from "mongoose";
import { ForbiddenException } from "../auth";
import { User } from "./user.model";
import { compareSync, hashSync } from "bcryptjs";

export interface IUserDocument extends User, Document {
	id: string;
	generateAuthToken(): Promise<string>;
}

export const TOKEN_SECRET = process.env.TOKEN_SECRET || "secret";

const UserSchema = new Schema(
	{
		name: { type: String, required: true },
		password: { type: String, required: true, minlength: 6 },
		bio: { type: String, required: true },
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		accessToken: {
			type: String,
		},
	},
	{
		versionKey: false,
		collection: "Users",
		timestamps: { createdAt: true, updatedAt: true },
	}
);

UserSchema.pre("save", async function (next) {
	const user: IUserDocument = this;

	if (user.isModified("password")) {
		user.password = hashSync(user.password, 12);
	}

	next();
});

UserSchema.methods.toJSON = function () {
	const user = this as IUserDocument;
	const { _id, password, accessToken, ...rest } = user.toObject();

	return { id: _id.toString(), ...rest };
};

UserSchema.methods.generateAuthToken = async function () {
	const user = this as IUserDocument;
	const token = jwt.sign({ _id: user._id }, TOKEN_SECRET, { expiresIn: "8h" });

	user.accessToken = token;

	await user.save();

	return token;
};

UserSchema.statics.findByToken = async function (
	token: string
): Promise<IUserDocument> {
	const UsersModel = this;
	let decoded: any;

	try {
		decoded = jwt.verify(token, TOKEN_SECRET);
	} catch {
		throw new ForbiddenException();
	}

	const user = await UsersModel.findOne({
		_id: decoded._id,
		accessToken: token,
	});

	if (!user) {
		return Promise.reject("Token expired");
	}

	return user;
};

UserSchema.statics.findByCredentials = async function (
	email: string,
	password: string
): Promise<IUserDocument> {
	let User = this;

	const user = await User.findOne({ email });

	if (!user) {
		return Promise.reject("Invalid login credentials");
	}

	if (!compareSync(password, user.password)) {
		return Promise.reject("Wrong password");
	}

	return user;
};

export { UserSchema };
