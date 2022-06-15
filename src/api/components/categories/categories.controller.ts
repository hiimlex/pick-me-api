import { BaseController } from "../../../core/controllers";
import { CategoriesRepository } from "./categories.repository";

class CategoriesController extends BaseController {
	apiPrefix = "/categories";

	constructor() {
		super();

		this.initRoutes();
	}

	initRoutes(): void {
		this.router.get(this.apiPrefix, [], CategoriesRepository.index);
	}
}

export { CategoriesController };
