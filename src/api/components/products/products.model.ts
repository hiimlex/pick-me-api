import { model, Model } from "mongoose";
import { User } from "../users";
import { IProductDocument, ProductsSchema } from "./products.schema";

export interface Product {
	_id: number;
	name: string;
	description: string;
	price: number;
	quantity?: number;
	image: string;
	category: string;
	createdAt: Date;
	updatedAt: Date;
	owner: User;
}

interface IProductsModel extends Model<IProductDocument> {}

const ProductsModel: IProductsModel = model<IProductDocument, IProductsModel>(
	"Products",
	ProductsSchema
);

export { ProductsModel };
