import { Schema } from "mongoose";
import { Product } from "./products.model";

export interface IProductDocument extends Product, Document {
	isNew: boolean;
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
		category: { type: String, required: true },
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

	const { _id, ...rest } = product.toObject();

	return { id: _id, ...rest };
};

export { ProductsSchema };
