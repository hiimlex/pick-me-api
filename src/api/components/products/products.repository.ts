import { Request, Response } from "express";
import { HttpException } from "../../../core/utils";
import { ForbiddenException, UnauthorizedException } from "../auth";
import { UsersModel } from "../users";
import { Product, ProductsModel } from "./products.model";

class ProdutsRepositoryClass {
	async index(req: Request, res: Response): Promise<Response<Product[]>> {
		try {
			const products = await ProductsModel.find({}).populate(
				"owner",
				"-password -accessToken -createdAt -updatedAt"
			);

			return res.status(200).json(products);
		} catch (err: any) {
			return res.status(400).json({ error: err.toString() });
		}
	}

	async create(req: Request, res: Response): Promise<Response<Product>> {
		try {
			let token = req.headers.authorization;

			if (!token) {
				throw new UnauthorizedException();
			}

			token = token.replace("Bearer", "").trim();

			const user = await UsersModel.findByToken(token);

			if (!user) {
				throw new ForbiddenException();
			}

			const body = req.body;
			body.owner = user._id;

			const product = await ProductsModel.create(body);

			await product.populate(
				"owner",
				"-password -accessToken -createdAt -updatedAt"
			);

			return res.status(201).json(product);
		} catch (err: any) {
			console.log(err);

			if (err instanceof HttpException) {
				return res.status(err.status).json({ error: err.message });
			}

			return res.status(400).json({ error: err.toString() });
		}
	}
}

const ProductsRepository: ProdutsRepositoryClass = new ProdutsRepositoryClass();

export { ProductsRepository };
