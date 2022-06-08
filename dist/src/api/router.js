"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controller_1 = __importDefault(require("./components/auth/auth.controller"));
const categories_1 = require("./components/categories");
const products_controller_1 = __importDefault(require("./components/products/products.controller"));
const users_controller_1 = __importDefault(require("./components/users/users.controller"));
const userController = new users_controller_1.default();
const authController = new auth_controller_1.default();
const productController = new products_controller_1.default();
const categoryController = new categories_1.CategoriesController();
const appRouter = (app) => {
    app.use("/api", userController.router);
    app.use("/api", authController.router);
    app.use("/api", productController.router);
    app.use("/api", categoryController.router);
};
exports.default = appRouter;
