"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_repository_1 = require("./auth.repository");
const controllers_1 = require("../../../core/controllers");
class AuthController extends controllers_1.BaseController {
    constructor() {
        super();
        this.apiPrefix = "/auth";
        this.initRoutes();
    }
    initRoutes() {
        this.router.post(this.apiPrefix + "/signin", auth_repository_1.AuthRepository.login);
        this.router.get(this.apiPrefix + "/currentUser", [], auth_repository_1.AuthRepository.isAuthenticated, auth_repository_1.AuthRepository.currentUser);
    }
}
exports.default = AuthController;
