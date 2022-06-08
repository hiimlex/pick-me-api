import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { HttpException } from "../../../core/utils";
import { ForbiddenException, UnauthorizedException } from "../auth";
import { getUserByToken, ProductsModel } from "../products";
import { User, UsersModel } from "./user.model";

class UsersRepositoryClass {
	async index(req: Request, res: Response): Promise<Response<User[]>> {
		try {
			const users = await UsersModel.find({});

			if (!users) {
				throw new NotFoundUserException();
			}

			return res.status(200).json(users);
		} catch (err: any) {
			if (err instanceof HttpException) {
				return res.status(err.status).json({ error: err.message });
			}

			return res.status(500).json({ error: err.message });
		}
	}

	async show(req: Request, res: Response): Promise<Response<User>> {
		try {
			const user = await UsersModel.findById(req.params.id);

			if (!user) {
				throw new NotFoundUserException();
			}

			return res.status(200).json(user);
		} catch (err: any) {
			if (err instanceof HttpException) {
				return res.status(err.status).json({ error: err.message });
			}

			return res.status(500).json({ error: err.message });
		}
	}

	async create(req: Request, res: Response): Promise<Response<User>> {
		try {
			const user = await UsersModel.create(req.body);

			return res.status(201).json(user);
		} catch (err: any) {
			if (err instanceof HttpException) {
				return res.status(err.status).json({ error: err.message });
			}

			return res.status(500).json({ error: err.message });
		}
	}

	async update(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<Response<User>> {
		try {
			const body = req.body;
			const id = req.params.id;

			const user = await getUserByToken(req, next);

			if (!user) {
				throw new UnauthorizedException();
			}

			if (id !== user.id) {
				throw new ForbiddenException();
			}

			await user.updateOne(body);

			const updatedUser = await UsersModel.findById(id);

			return res.status(200).json({ updatedUser });
		} catch (err: any) {
			if (err instanceof HttpException) {
				return res.status(err.status).json({ error: err.message });
			}

			return res.status(500).json({ error: err.message });
		}
	}

	async delete(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<Response<{ deletedUser: User }>> {
		try {
			const id = req.params.id;

			const user = await getUserByToken(req, next);

			if (!user) {
				throw new UnauthorizedException();
			}

			if (id !== user.id) {
				throw new ForbiddenException();
			}

			const products = await ProductsModel.find({
				owner: new mongoose.Types.ObjectId(user.id),
			});

			if (products.length > 0) {
				console.log(products);
			}

			// await user.deleteOne();

			// const deletedUser = await UsersModel.findById(id);

			return res.status(200).json({});
		} catch (err: any) {
			if (err instanceof HttpException) {
				return res.status(err.status).json({ error: err.message });
			}

			return res.status(500).json({ error: err.message });
		}
	}
}

class NotFoundUserException extends HttpException {
	constructor() {
		super(404, "User not found");
	}
}

const UsersRepository: UsersRepositoryClass = new UsersRepositoryClass();

export { UsersRepository };
