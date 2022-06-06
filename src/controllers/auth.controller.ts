import { times } from "underscore";
import AuthService from "../services/auth.service";
import BaseController from "./base.controller";

class AuthController extends BaseController {
  public apiPrefix = "/auth";

  constructor() {
    super();

    this.initRoutes();
  }

  public initRoutes(): void {
    this.router.post(this.apiPrefix + "/signin", AuthService.login);
    this.router.get(
      this.apiPrefix + "/currentUser",
      [],
      AuthService.verifyToken,
      AuthService.currentUser
    );
  }
}

export default AuthController;
