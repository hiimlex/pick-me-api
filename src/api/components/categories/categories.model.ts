import { model, Model } from "mongoose";
import { CategoriesSchema, ICategoryDocument } from "./categories.schema";

interface Category {
	id: string;
	name: string;
}

interface ICategoriesModel extends Model<ICategoryDocument> {}

const CategoriesModel: ICategoriesModel = model<
	ICategoryDocument,
	ICategoriesModel
>("Categories", CategoriesSchema);

export { Category, CategoriesModel };
