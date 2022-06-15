import { Schema } from "mongoose";
import { Product } from "./products.model";

export interface IProductDocument extends Product, Document {
	id: string;
	categoryName: string;
	imageData: string;
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
		},
		price: { type: Number, required: true },
		quantity: {
			type: Number,
		},
		image: {
			ref: "Files",
			type: Schema.Types.ObjectId,
		},
		postColor: {
			type: String,
			default: "#ffffff"
		},
		category: {
			ref: "Categories",
			type: Schema.Types.ObjectId,
		},
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

	const { _id, category, image, ...rest } = product.toObject();

	let categoryName = "";

	if (category && category.name) {
		categoryName = category.name;
	}

	let imageData = "";

	if (image && image.image) {
		imageData = image.image;
	}

	return { id: _id.toString(), categoryName, imageData, ...rest };
};

export { ProductsSchema };
