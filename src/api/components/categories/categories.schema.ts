import { Schema } from "mongoose";
import { Category } from "./categories.model";

export interface ICategoryDocument extends Category, Document {
	id: string;
}

const CategoriesSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
	},
	{
		versionKey: false,
		collection: "Categories",
	}
);

CategoriesSchema.methods.toJson = function () {
	const category = this;

	const { _id, ...rest } = category.toObject();

	return { id: _id.toString(), ...rest };
};

export { CategoriesSchema };
