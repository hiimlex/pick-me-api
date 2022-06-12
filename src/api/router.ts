import express from "express";
import AuthController from "./components/auth/auth.controller";
import { CategoriesController } from "./components/categories";
import FilesController from "./components/files/files.controller";
import ProductsController from "./components/products/products.controller";
import UsersController from "./components/users/users.controller";

const userController = new UsersController();
const authController = new AuthController();
const productController = new ProductsController();
const categoryController = new CategoriesController();
const fileController = new FilesController();

const appRouter = (app: express.Application) => {
	app.use("/api", userController.router);
	app.use("/api", authController.router);
	app.use("/api", productController.router);
	app.use("/api", categoryController.router);
	app.use("/api", fileController.router);
};

export default appRouter;
