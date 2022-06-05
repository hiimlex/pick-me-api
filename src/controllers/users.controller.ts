import UsersService from "../services/users.service";
import BaseController from "./base.controller";

class UsersController extends BaseController {
  public apiPrefix = "/users";

  constructor() {
    super();

    this.initRoutes();
  }

  public initRoutes(): void {
    this.router.get(this.apiPrefix, [], UsersService.index);
    this.router.get(this.apiPrefix + "/:id", [], UsersService.show);
    this.router.post(this.apiPrefix, UsersService.create);
    this.router.put(this.apiPrefix + "/:id", UsersService.update);
    this.router.delete(this.apiPrefix + "/:id", UsersService.delete);
  }
}

export default UsersController;
