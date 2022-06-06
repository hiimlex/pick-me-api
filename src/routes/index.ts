import express from "express";
import AuthController from "../controllers/auth.controller";
import UsersController from "../controllers/users.controller";

const userController = new UsersController();
const authController = new AuthController();

const appRouter = (app: express.Application) => {
  app.use("/api", userController.router);
  app.use("/api", authController.router);
};

export default appRouter;
