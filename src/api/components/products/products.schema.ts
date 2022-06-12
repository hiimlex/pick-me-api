import { Schema } from "mongoose";
import { Product } from "./products.model";

export interface IProductDocument extends Product, Document {
	id: string;
	categoryName: string;
	populateAll: () => Promise<IProductDocument>;
}

const ProductsSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		price: { type: Number, required: true },
		quantity: {
			type: Number,
		},
		image: {
			ref: "Files",
			type: Schema.Types.ObjectId,
		},
		category: { type: Schema.Types.ObjectId, ref: "Categories" },
		owner: {
			ref: "Users",
			type: Schema.Types.ObjectId,
		},
	},
	{
		versionKey: false,
		collection: "Products",
		timestamps: true,
	}
);

ProductsSchema.methods.toJSON = function () {
	const product = this;

	const { _id, category, ...rest } = product.toObject();

	let categoryName = "";

	if (category && category.name) {
		categoryName = category.name;
	}

	return { id: _id.toString(), categoryName, ...rest };
};

export { ProductsSchema };
