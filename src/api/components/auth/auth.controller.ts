import { AuthRepository } from "./auth.repository";
import { BaseController } from "../../../core/controllers";

class AuthController extends BaseController {
	apiPrefix = "/auth";

	constructor() {
		super();

		this.initRoutes();
	}

	initRoutes(): void {
		this.router.post(this.apiPrefix + "/signin", AuthRepository.login);
		this.router.get(
			this.apiPrefix + "/currentUser",
			[],
			AuthRepository.isAuthenticated,
			AuthRepository.currentUser
		);
	}
}

export default AuthController;

