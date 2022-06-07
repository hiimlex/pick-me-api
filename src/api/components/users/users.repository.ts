import { Request, Response } from "express";
import { HttpException } from "../../../core/utils";
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

	async update(req: Request, res: Response): Promise<Response<User>> {
		try {
			const user = await UsersModel.findByIdAndUpdate(req.params.id, req.body, {
				new: false,
			});

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

	async delete(
		req: Request,
		res: Response
	): Promise<Response<{ deletedUser: User }>> {
		try {
			const user = await UsersModel.findByIdAndRemove(req.params.id);

			if (!user) {
				throw new NotFoundUserException();
			}

			return res.status(200).json({ deletedUser: user });
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
