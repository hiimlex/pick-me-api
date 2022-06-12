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
		this.router.get(this.apiPrefix, [], ProductsRepository.index);

		this.router.post(
			this.apiPrefix,
			AuthRepository.isAuthenticated,
			ProductsRepository.create
		);

		this.router.get(
			this.apiPrefix + "/:id",
			[],
			AuthRepository.isAuthenticated,
			ProductsRepository.show
		);

		this.router.put(
			this.apiPrefix + "/:id",
			AuthRepository.isAuthenticated,
			ProductsRepository.update
		);

		this.router.delete(
			this.apiPrefix + "/:id",
			AuthRepository.isAuthenticated,
			ProductsRepository.delete
		);
	}
}

export default ProductsController;
