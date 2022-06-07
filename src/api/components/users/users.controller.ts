import { UsersRepository } from "./users.repository";
import { AuthRepository } from "../auth/auth.repository";
import BaseController from "../../../core/controllers/base.controller";

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
      AuthRepository.verifyToken,
      UsersRepository.index
    );
    this.router.get(
      this.apiPrefix + "/:id",
      [],
      AuthRepository.verifyToken,
      UsersRepository.show
    );
    this.router.post(this.apiPrefix, UsersRepository.create);
    this.router.put(
      this.apiPrefix + "/:id",
      AuthRepository.verifyToken,
      UsersRepository.update
    );
    this.router.delete(
      this.apiPrefix + "/:id",
      AuthRepository.verifyToken,
      UsersRepository.delete
    );
  }
}

export default UsersController;
