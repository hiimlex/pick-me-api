"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controllers_1 = require("../../../core/controllers");
const auth_1 = require("../auth");
const products_repository_1 = require("./products.repository");
class ProductsController extends controllers_1.BaseController {
    constructor() {
        super();
        this.apiPrefix = "/products";
        this.initRoutes();
    }
    initRoutes() {
        this.router.get(this.apiPrefix, [], auth_1.AuthRepository.isAuthenticated, products_repository_1.ProductsRepository.index);
        this.router.post(this.apiPrefix, auth_1.AuthRepository.isAuthenticated, products_repository_1.ProductsRepository.create);
        this.router.get(this.apiPrefix + "/:id", [], auth_1.AuthRepository.isAuthenticated, products_repository_1.ProductsRepository.show);
        this.router.put(this.apiPrefix + "/:id", auth_1.AuthRepository.isAuthenticated, products_repository_1.ProductsRepository.update);
        this.router.delete(this.apiPrefix + "/:id", auth_1.AuthRepository.isAuthenticated, products_repository_1.ProductsRepository.delete);
    }
}
exports.default = ProductsController;
