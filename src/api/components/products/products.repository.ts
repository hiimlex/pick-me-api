import { NextFunction, Request, Response } from "express";
import { FilterQuery } from "mongoose";
import { HttpException } from "../../../core/utils";
import { ForbiddenException, UnauthorizedException } from "../auth";
import { IUserDocument, UsersModel } from "../users";
import { Product, ProductsModel } from "./products.model";
import { IProductDocument } from "./products.schema";

const ObjectId = require("mongoose").Types.ObjectId;

class ProdutsRepositoryClass {
	async index(req: Request, res: Response): Promise<Response<Product[]>> {
		try {
			const filters = req.query;
			let query: FilterQuery<IProductDocument> = {};

			if (filters && Object.keys(filters).length) {
				if (filters.ownerId) {
					query.owner = ObjectId(filters.ownerId);
				}

				if (filters.productName) {
					query.name = { $regex: new RegExp(filters.productName + "", "gmi") };
				}

				if (filters.categoryId) {
					query.category = ObjectId(filters.categoryId);
				}
			}

			const products = await ProductsModel.find(query)
				.populate("owner", "name bio email ")
				.populate("category", "-_id");

			return res.status(200).json(products);
		} catch (err: any) {
			if (err instanceof HttpException) {
				return res.status(err.status).json({ error: err.message });
			}

			return res.status(500).json({ error: err.toString() });
		}
	}

	async show(req: Request, res: Response): Promise<Response<Product>> {
		try {
			const id = req.params.id;

			const product = await ProductsModel.findById(id)
				.populate("owner", "name bio email ")
				.populate("category", "-_id");

			if (!product) {
				throw new NotFoundProductException();
			}

			return res.status(200).json(product);
		} catch (err: any) {
			if (err instanceof HttpException) {
				return res.status(err.status).json({ error: err.message });
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
			const authenticatedUser = await getUserByToken(req, next);

			if (!authenticatedUser) {
				throw new ForbiddenException();
			}

			const body = req.body;
			body.owner = authenticatedUser._id;

			const product = await ProductsModel.create(body);

			const newProduct = await ProductsModel.findById(product._id)
				.populate("owner", "name bio email ")
				.populate("category", "-_id");

			if (!newProduct) {
				throw new NotFoundProductException();
			}

			return res.status(201).json({ createdProduct: newProduct });
		} catch (err: any) {
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

			const query: FilterQuery<IProductDocument> = {
				_id: ObjectId(id),
				owner: ObjectId(authenticatedUser.id),
			};

			const product = await ProductsModel.findOne(query);

			if (!product) {
				throw new ForbiddenException();
			}

			await product.updateOne(body);

			const updatedProduct = await ProductsModel.findById(id)
				.populate("owner", "name bio email ")
				.populate("category", "-_id");

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

			const query: FilterQuery<IProductDocument> = {
				_id: ObjectId(id),
				owner: ObjectId(authenticatedUser.id),
			};

			const product = await ProductsModel.findOne(query)
				.populate("owner", "name bio email ")
				.populate("category", "-_id");

			if (!product) {
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
