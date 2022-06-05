import express from "express";
import UsersController from "../controllers/users.controller";

const userController = new UsersController();

const appRouter = (app: express.Application) => {
  app.use("/api", userController.router);
};

export default appRouter;
