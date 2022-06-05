import mongoose from "mongoose";
import { CounterModel } from "./counter.model";

interface IUser {
  _id: string;
  name: string;
  bio?: string;
  email: string;
}

const userSchema = new mongoose.Schema(
  {
    _id: { type: Number, alias: "id", required: true },
    name: { type: String, required: true },
    bio: { type: String },
    email: { type: String, required: true },
  },
  { versionKey: false }
);

userSchema.pre("save", async function (next) {
  const userRef: any = this;

  if (!userRef.isNew) {
    return;
  }

  const counter = await CounterModel.increment("user");
  userRef._id = counter;
});

const UsersDocument = mongoose.model<IUser>("User", userSchema);

export { UsersDocument, IUser };
