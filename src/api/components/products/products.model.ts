import { model, Model, ObjectId } from "mongoose";
import { IProductDocument, ProductsSchema } from "./products.schema";

interface IProductUser {
	_id: ObjectId;
	name: string;
	email: string;
}
interface Product {
	id: string;
	name: string;
	description: string;
	price: number;
	quantity?: number;
	image: string;
	category: string;
	createdAt: Date;
	updatedAt: Date;
	owner: IProductUser;
}

interface IProductsModel extends Model<IProductDocument> {}

const ProductsModel: IProductsModel = model<IProductDocument, IProductsModel>(
	"Products",
	ProductsSchema
);

export { ProductsModel, Product };
