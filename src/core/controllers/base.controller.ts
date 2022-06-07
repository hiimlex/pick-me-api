import { Router } from "express";

abstract class BaseController {
	router = Router();
	abstract apiPrefix: string;

	constructor() {}

	abstract initRoutes(): void;
}

export { BaseController };
