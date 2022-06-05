import { Router } from "express";

abstract class BaseController {
  public router = Router();
  public abstract apiPrefix: string;

  constructor() {}

  public abstract initRoutes(): void;
}

export default BaseController;
