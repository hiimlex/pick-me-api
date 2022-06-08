import { NextFunction, Request, Response } from "express";
import { HttpException } from "../../../core/utils";
import { ForbiddenException, UnauthorizedException } from "../auth";
import { IUserDocument, UsersModel } from "../users";
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

	async show(req: Request, res: Response): Promise<Response<Product>> {
		try {
			const id = req.params.id;

			const product = await ProductsModel.findById(id).populate(
				"owner",
				"-password -accessToken -createdAt -updatedAt -bio"
			);

			if (!product) {
				throw new NotFoundProductException();
			}

			return res.status(200).json(product);
		} catch (err: any) {
			if (err instanceof HttpException) {
				return res.send(err.status).json({ error: err.message });
			}

			return res.status(500).json({ error: err.toString() });
		}
	}

	async create(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<Response<Product>> {
		try {
			const authorizedUser = await getUserByToken(req, next);

			if (!authorizedUser) {
				throw new ForbiddenException();
			}

			const body = req.body;
			body.owner = authorizedUser._id;

			const product = await ProductsModel.create(body);

			await product.populate(
				"owner",
				"-password -accessToken -createdAt -updatedAt -bio"
			);

			await product.save();

			return res.status(201).json(product);
		} catch (err: any) {
			console.log(err);

			if (err instanceof HttpException) {
				return res.status(err.status).json({ error: err.message });
			}

			return res.status(400).json({ error: err.toString() });
		}
	}

	async update(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<Response<Product>> {
		try {
			const id = req.params.id;
			const body = req.body;

			const authenticatedUser = await getUserByToken(req, next);

			if (!authenticatedUser) {
				throw new UnauthorizedException();
			}

			const product = await ProductsModel.findById(id);

			if (!product || product.owner._id + "" !== authenticatedUser.id) {
				throw new ForbiddenException();
			}

			await product.updateOne(body);

			const updatedProduct = await ProductsModel.findById(id).populate(
				"owner",
				"-password -accessToken -createdAt -updatedAt -bio"
			);

			if (!updatedProduct) {
				throw new NotFoundProductException();
			}

			return res.status(200).json(updatedProduct);
		} catch (err: any) {
			if (err instanceof HttpException) {
				return res.status(err.status).json({ error: err.message });
			}

			return res.status(500).json({ error: err.toString() });
		}
	}

	async delete(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<Response<null>> {
		try {
			const id = req.params.id;

			const authenticatedUser = await getUserByToken(req, next);

			if (!authenticatedUser) {
				throw new UnauthorizedException();
			}

			const product = await ProductsModel.findById(id);

			if (!product || product.owner._id + "" !== authenticatedUser.id) {
				throw new ForbiddenException();
			}

			await product.deleteOne();

			return res.status(200).json({ deletedProduct: product });
		} catch (err: any) {
			if (err instanceof HttpException) {
				return res.status(err.status).json({ error: err.message });
			}

			return res.status(500).json({ error: err.toString() });
		}
	}
}

async function getUserByToken(
	req: Request,
	next: NextFunction
): Promise<IUserDocument> {
	try {
		let token = req.headers.authorization;

		if (!token) {
			throw new UnauthorizedException();
		}

		token = token.replace("Bearer", "").trim();

		const authenticatedUser = await UsersModel.findByToken(token);

		if (!authenticatedUser) {
			throw new ForbiddenException();
		}

		return authenticatedUser;
	} catch (err: any) {
		throw new UnauthorizedException();
	}
}

class NotFoundProductException extends HttpException {
	constructor() {
		super(404, "Product not found");
	}
}

const ProductsRepository: ProdutsRepositoryClass = new ProdutsRepositoryClass();

export { ProductsRepository, getUserByToken, NotFoundProductException };
