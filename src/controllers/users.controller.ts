import UsersService from "../services/users.service";
import AuthService from "../services/auth.service";
import BaseController from "./base.controller";

class UsersController extends BaseController {
  public apiPrefix = "/users";

  constructor() {
    super();

    this.initRoutes();
  }

  public initRoutes(): void {
    this.router.get(
      this.apiPrefix,
      [],
      AuthService.verifyToken,
      UsersService.index
    );
    this.router.get(
      this.apiPrefix + "/:id",
      [],
      AuthService.verifyToken,
      UsersService.show
    );
    this.router.post(this.apiPrefix, UsersService.create);
    this.router.put(
      this.apiPrefix + "/:id",
      AuthService.verifyToken,
      UsersService.update
    );
    this.router.delete(
      this.apiPrefix + "/:id",
      AuthService.verifyToken,
      UsersService.delete
    );
  }
}

export default UsersController;
