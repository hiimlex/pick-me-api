import { BaseController } from "../../../core/controllers";
import { AuthRepository } from "../auth";
import { CategoriesModel } from "./categories.model";
import { CategoriesRepository } from "./categories.repository";

class CategoriesController extends BaseController {
	apiPrefix = "/categories";

	constructor() {
		super();

		this.initRoutes();
		this.generateCategories();
	}

	generateCategories(): void {
		const categories = [
			{ name: "Art" },
			{ name: "Product" },
			{ name: "Service" },
		];

		categories.forEach(async (item) => {
			const hasCategory = await CategoriesModel.findOne({ name: item.name });

			if (!hasCategory) {
				const category = await CategoriesModel.create({ name: item.name });

				await category.save();
			}
		});
	}

	initRoutes(): void {
		this.router.get(
			this.apiPrefix,
			[],
			AuthRepository.isAuthenticated,
			CategoriesRepository.index
		);
	}
}

export { CategoriesController };
