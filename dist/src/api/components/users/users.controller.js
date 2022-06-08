"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users_repository_1 = require("./users.repository");
const auth_repository_1 = require("../auth/auth.repository");
const base_controller_1 = require("../../../core/controllers/base.controller");
class UsersController extends base_controller_1.BaseController {
    constructor() {
        super();
        this.apiPrefix = "/users";
        this.initRoutes();
    }
    initRoutes() {
        this.router.get(this.apiPrefix, [], users_repository_1.UsersRepository.index);
        this.router.get(this.apiPrefix + "/:id", [], auth_repository_1.AuthRepository.isAuthenticated, users_repository_1.UsersRepository.show);
        this.router.post(this.apiPrefix, users_repository_1.UsersRepository.create);
        this.router.put(this.apiPrefix + "/:id", auth_repository_1.AuthRepository.isAuthenticated, users_repository_1.UsersRepository.update);
        this.router.delete(this.apiPrefix + "/:id", auth_repository_1.AuthRepository.isAuthenticated, users_repository_1.UsersRepository.delete);
    }
}
exports.default = UsersController;
