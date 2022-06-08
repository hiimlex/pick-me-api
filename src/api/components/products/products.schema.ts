import { Schema } from "mongoose";
import { Product } from "./products.model";

export interface IProductDocument extends Product, Document {
	id: string;
	categoryName: string;
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
		image: { type: String, required: true },
		category: { type: Schema.Types.ObjectId, ref: "Categories" },
		owner: {
			ref: "Users",
			type: Schema.Types.ObjectId,
		},
	},
	{
		versionKey: false,
		collection: "Products",
		timestamps: { createdAt: true, updatedAt: true },
	}
);

ProductsSchema.methods.toJSON = function () {
	const product = this;

	console.log(product);

	const { _id, category, ...rest } = product.toObject();

	return { id: _id.toString(), categoryName: category.name, ...rest };
};

export { ProductsSchema };
