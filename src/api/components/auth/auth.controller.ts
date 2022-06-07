import { AuthRepository } from "./auth.repository";
import BaseController from "../../../core/controllers/base.controller";

class AuthController extends BaseController {
  public apiPrefix = "/auth";

  constructor() {
    super();

    this.initRoutes();
  }

  public initRoutes(): void {
    this.router.post(this.apiPrefix + "/signin", AuthRepository.login);
    this.router.get(
      this.apiPrefix + "/currentUser",
      [],
      AuthRepository.verifyToken,
      AuthRepository.currentUser
    );
  }
}

export default AuthController;
