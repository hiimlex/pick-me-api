import { BaseController } from "../../../core/controllers";
import { AuthRepository } from "../auth";
import { CategoriesRepository } from "./categories.repository";

class CategoriesController extends BaseController {
	apiPrefix = "/categories";

	constructor() {
		super();

		this.initRoutes();
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
