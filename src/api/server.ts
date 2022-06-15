import { json } from "body-parser";
import express from "express";
import connection from "../../db/connection";
import appRouter from "./router";
import cors from "cors";
import { CategoriesModel } from "./components/categories";
class Server {
	express!: express.Application;
	apiPrefix = process.env.API_PREFIX || "/api";

	constructor() {
		this.express = express();

		this.middlewares();
		this.routes();
		this.connectDB();
	}

	private async connectDB() {
		try {
			await connection.then(() => {
				console.log("Database is connected");
			});

			this.generateCategories();
		} catch (err: any) {
			throw new Error(err);
		}
	}

	private generateCategories(): void {
		const categories = [
			{ name: "picture" },
			{ name: "product" },
			{ name: "service" },
		];

		categories.forEach(async (item) => {
			const hasCategory = await CategoriesModel.findOne({ name: item.name });

			if (!hasCategory) {
				const category = await CategoriesModel.create({ name: item.name });

				await category.save();
			}
		});
	}

	private middlewares(): void {
		this.express.use(json());
		this.express.use(cors());
	}

	private routes(): void {
		appRouter(this.express);
	}

	listen(port: string | number): void {
		this.express.listen(port, () => {
			console.log("server is running on port " + port);
		});
	}
}

export { Server };
