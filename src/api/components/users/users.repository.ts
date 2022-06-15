import { NextFunction, Request, Response } from "express";
import mongoose, { MongooseError } from "mongoose";
import { HttpException } from "../../../core/utils";
import { ForbiddenException, UnauthorizedException } from "../auth";
import { FilesModel, NotFoundFileException } from "../files";
import { getUserByToken, ProductsModel } from "../products";
import { User, UsersModel } from "./users.model";

class UsersRepositoryClass {
	async index(req: Request, res: Response): Promise<Response<User[]>> {
		try {
			const users = await UsersModel.find({}).populate("avatar", "-_id");

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
			const user = await UsersModel.findById(req.params.id).populate(
				"avatar",
				"-_id"
			);

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
			if (!req.file) {
				throw new NotFoundFileException();
			}

			const image = req.file.buffer;

			const createdImage = await FilesModel.create({ image });
			await createdImage.save();

			const data = JSON.parse(req.body.data);
			data.avatar = createdImage._id;

			const user = await UsersModel.create(data);
			await user.save();

			const newUser = await UsersModel.findById(user.id).populate(
				"avatar",
				"-_id"
			);

			if (!newUser) {
				throw new NotFoundUserException();
			}

			return res.status(201).json({ createdUser: user });
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

			const updatedUser = await UsersModel.findById(id).populate(
				"avatar",
				"-_id"
			);

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

			await ProductsModel.findOneAndRemove({
				owner: new mongoose.Types.ObjectId(user.id),
			}).populate("avatar", "-_id");

			await user.deleteOne();

			const deletedUser = await UsersModel.findById(id);

			return res.status(200).json({ deletedUser });
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

export { UsersRepository, NotFoundUserException };
