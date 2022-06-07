import express from "express";
import AuthController from "./components/auth/auth.controller";
import ProductsController from "./components/products/products.controller";
import UsersController from "./components/users/users.controller";

const userController = new UsersController();
const authController = new AuthController();
const productController = new ProductsController();

const appRouter = (app: express.Application) => {
	app.use("/api", userController.router);
	app.use("/api", authController.router);
	app.use("/api", productController.router);
};

export default appRouter;
