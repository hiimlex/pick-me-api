import { model, Schema, Document, Model } from "mongoose";
import { User } from "../models";
import { CounterModel } from "./counter.schema";
import * as jwt from "jsonwebtoken";
import * as passwordHash from "password-hash";

interface IUserDocument extends User, Document {
  _id: number;
  generateAuthToken(): Promise<string>;
  removeToken(token: string): Promise<void>;
}

interface IUserModel extends Model<IUserDocument> {
  findByToken(token: string): Promise<IUserDocument>;
  findByCredentials(email: string, password: string): Promise<IUserDocument>;
}

export const TOKEN_SECRET = process.env.TOKEN_SECRET || "secret";

const UserSchema = new Schema(
  {
    _id: {
      type: Number,
      alias: "id",
      required: true,
    },
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
    collection: "users",
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

UserSchema.pre("save", async function (next) {
  const user: IUserDocument = this;

  if (user.isNew) {
    const idCounter = await CounterModel.increment("user");
    user._id = idCounter;
  }

  if (user.isModified("password")) {
    user.password = passwordHash.generate(user.password);
  }

  next();
});

UserSchema.methods.toJSON = function () {
  const user = this as IUserDocument;
  const { _id, password, accessToken, ...rest } = user.toObject();

  return { id: _id, ...rest };
};

UserSchema.methods.generateAuthToken = async function () {
  const user = this as IUserDocument;
  const token = jwt.sign({ _id: user._id }, TOKEN_SECRET);

  user.accessToken = token;

  await user.save();

  return token;
};

UserSchema.methods.removeToken = async function (token: string): Promise<void> {
  const user = this;

  return user.update({
    $pull: {
      accessToken: token,
    },
  });
};

UserSchema.statics.findByToken = async function (
  token: string
): Promise<IUserDocument> {
  const UsersModel = this;
  let decoded: any;

  try {
    decoded = jwt.verify(token, TOKEN_SECRET);
  } catch {
    return Promise.reject("Invalid token");
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

  if (!passwordHash.verify(password, user.password)) {
    return Promise.reject("Wrong password");
  }

  return user;
};
// TODO: Search for the type notation
const UsersModel: IUserModel = model<IUserDocument, any>("User", UserSchema);

export { UsersModel };
