import { UsersRepository } from "./users.repository";
import { AuthRepository } from "../auth/auth.repository";
import { BaseController } from "../../../core/controllers/base.controller";

class UsersController extends BaseController {
	apiPrefix = "/users";

	constructor() {
		super();

		this.initRoutes();
	}

	initRoutes(): void {
		this.router.get(this.apiPrefix, [], UsersRepository.index);
		this.router.get(
			this.apiPrefix + "/:id",
			[],
			AuthRepository.isAuthenticated,
			UsersRepository.show
		);
		this.router.post(this.apiPrefix, UsersRepository.create);
		this.router.put(
			this.apiPrefix + "/:id",
			AuthRepository.isAuthenticated,
			UsersRepository.update
		);
		this.router.delete(
			this.apiPrefix + "/:id",
			AuthRepository.isAuthenticated,
			UsersRepository.delete
		);
	}
}

export default UsersController;

