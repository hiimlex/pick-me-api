import { Request, Response } from "express";
import { HttpException } from "../../../core/utils";
import { CategoriesModel, Category } from "./categories.model";

class CategoriesRepositoryClass {
	async index(req: Request, res: Response): Promise<Response<Category[]>> {
		try {
			const categories = await CategoriesModel.find({});

			if (!categories) {
				throw new NotFoundCategoryException();
			}

			return res.status(200).json(categories);
		} catch (err: any) {
			if (err instanceof HttpException) {
				return res.status(err.status).json({ error: err.message });
			}

			return res.status(500).json({ error: err.toString() });
		}
	}
}

class NotFoundCategoryException extends HttpException {
	constructor() {
		super(404, "Category not found");
	}
}

const CategoriesRepository = new CategoriesRepositoryClass();

export { CategoriesRepository };
