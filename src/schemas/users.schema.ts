import { model, Schema, Document } from "mongoose";
import { User } from "../models";
import { CounterModel } from "./counter.schema";
import * as jwt from "jsonwebtoken";
import * as passwordHash from "password-hash";

interface UserDocument extends User, Document {
  _id: number;
}

const TOKEN_SECRET = process.env.TOKEN_SECRET || "secret";

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
    tokens: [
      {
        access: {
          type: String,
          required: true,
        },
        token: {
          type: String,
          required: true,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false, collection: "users" }
);

UserSchema.pre("save", async function (next) {
  const user: UserDocument = this;

  if (!user.isNew) {
    return;
  }

  const idCounter = await CounterModel.increment("user");
  user._id = idCounter;

  if (user.isModified("password")) {
    user.password = passwordHash.generate(user.password);
  }

  next();
});

UserSchema.methods.toJSON = function () {
  const user = this as UserDocument;
  const { _id, password, ...rest } = user.toObject();

  return rest;
};

UserSchema.methods.generateAuthToken = function () {
  const user = this as UserDocument;
  const access = "auth";
  const token = jwt.sign({ _id: user._id, access }, TOKEN_SECRET);

  user.tokens.push({ access, token });

  return user.save().then(() => {
    return token;
  });
};

UserSchema.methods.removeToken = async function (token: string): Promise<void> {
  const user = this;

  return user.update({
    $pull: {
      tokens: { token },
    },
  });
};

UserSchema.statics.findByToken = async function (
  token: string
): Promise<UserDocument> {
  const UserModel = this;
  let decoded: any;

  try {
    decoded = jwt.verify(token, TOKEN_SECRET);
  } catch {
    return Promise.reject("Invalid token");
  }

  const user = UserModel.findOne({
    _id: decoded._id,
    "tokens.token": token,
    "tokens.access": "auth",
  });

  if (!user) {
    return Promise.reject("User not found");
  }

  return user;
};

UserSchema.statics.findByCredentials = async function (
  email: string,
  password: string
): Promise<UserDocument> {
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

const UsersModel = model<UserDocument>("User", UserSchema);

export { UsersModel };
