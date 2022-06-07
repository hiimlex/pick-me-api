import { BaseController } from "../../../core/controllers";
import { AuthRepository } from "../auth";
import { ProductsRepository } from "./products.repository";

class ProductsController extends BaseController {
	apiPrefix = "/products";

	constructor() {
		super();

		this.initRoutes();
	}

	initRoutes(): void {
		this.router.get(
			this.apiPrefix,
			[],
			AuthRepository.isAuthenticated,
			ProductsRepository.index
		);

		this.router.post(
			this.apiPrefix,
			AuthRepository.isAuthenticated,
			ProductsRepository.create
		);
	}
}

export default ProductsController;
