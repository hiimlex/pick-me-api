import { Request, Response } from "express";
import { HttpException } from "../../../core/utils";
import { NotFoundProductException, ProductsModel } from "../products";
import { NotFoundUserException, UsersModel } from "../users";
import { FilesModel, FileType } from "./files.model";

class FilesRepositoryClass {
	async index(req: Request, res: Response): Promise<Response<FileType[]>> {
		try {
			const files = await FilesModel.find({});

			if (!files) {
				throw new NotFoundFileException();
			}

			return res.status(200).json(files);
		} catch (err: any) {
			if (err instanceof HttpException) {
				return res.status(err.status).json({ error: err.message });
			}

			return res.status(500).json({ error: err.toString() });
		}
	}

	async uploadProductFile(
		req: Request,
		res: Response
	): Promise<Response<FileType>> {
		try {
			const productId = req.params.id;

			const product = await ProductsModel.findById(productId);

			if (!product) {
				throw new NotFoundProductException();
			}

			if (!req.file) {
				throw new NotFoundFileException();
			}

			const image = req.file.buffer;

			if (!image) {
				throw new HttpException(400, "Invalid file");
			}

			const file = await FilesModel.create({ image });
			await file.save();

			await product.updateOne({ image: file._id });

			return res.status(200).json({ file });
		} catch (err: any) {
			if (err instanceof HttpException) {
				return res.status(err.status).json({ error: err.message });
			}

			return res.status(500).json({ error: err.toString() });
		}
	}

	async uploadUserFile(
		req: Request,
		res: Response
	): Promise<Response<FileType>> {
		try {
			const userId = req.params.id;

			const user = await UsersModel.findById(userId);

			if (!user) {
				throw new NotFoundUserException();
			}

			if (!req.file) {
				throw new NotFoundFileException();
			}

			const image = req.file.buffer;

			if (!image) {
				throw new HttpException(400, "Invalid file");
			}

			const file = await FilesModel.create({ image });
			await file.save();

			await user.updateOne({ avatar: file._id });

			return res.status(200).json({ file });
		} catch (err: any) {
			if (err instanceof HttpException) {
				return res.status(err.status).json({ error: err.message });
			}

			return res.status(500).json({ error: err.toString() });
		}
	}
}

class NotFoundFileException extends HttpException {
	constructor() {
		super(404, "File not found");
	}
}

const FilesRepository: FilesRepositoryClass = new FilesRepositoryClass();

export { FilesRepository, NotFoundFileException };
