import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { HttpException } from "../../../core/utils";
import { TOKEN_SECRET, User, UsersModel } from "../users";

class AuthRepositoryClass {
	async login(
		req: Request,
		res: Response
	): Promise<Response<{ token: string }>> {
		try {
			const { username, password } = req.body;

			const user = await UsersModel.findByCredentials(username, password);

			if (!user) {
				throw new UnauthorizedException();
			}

			const token = await user.generateAuthToken();

			if (!token) {
				return res.status(500).json({ error: "Failed to generate token" });
			}

			return res.status(200).json({ accessToken: token });
		} catch (err: any) {
			if (err instanceof HttpException) {
				return res.status(err.status).json({ error: err.message });
			}

			return res.status(500).json({ error: err.toString() });
		}
	}

	async currentUser(req: Request, res: Response): Promise<Response<User>> {
		try {
			let token = req.header("Authorization");

			if (!token) {
				throw new ForbiddenException();
			}

			token = token.replace("Bearer", "").trim();

			const user = await UsersModel.findOne({
				accessToken: token,
			}).populate("avatar", "-_id");

			if (!user) {
				throw new UnauthorizedException();
			}

			return res.status(200).json({ ...user.toJSON(), token });
		} catch (err: any) {
			if (err instanceof HttpException) {
				return res.status(err.status).json({ error: err.message });
			}
			return res.status(500).json({ error: "Failed to get the current user" });
		}
	}

	async isAuthenticated(req: Request, res: Response, next: NextFunction) {
		try {
			let token = req.headers.authorization;

			if (!token) {
				throw new ForbiddenException();
			}

			token = token.replace("Bearer", "").trim();

			let decoded: any = jwt.verify(token, TOKEN_SECRET);

			const user = await UsersModel.findOne({
				id: decoded._id,
				accessToken: token,
			});

			if (!user) {
				throw new UnauthorizedException();
			}

			next();
		} catch (err: any) {
			if (err instanceof HttpException) {
				return res.status(err.status).json({ error: err.message });
			}

			return res.status(500).json({ error: "Failed to authenticate the user" });
		}
	}
}

class UnauthorizedException extends HttpException {
	constructor() {
		super(401, "Invalid Token");
	}
}

class ForbiddenException extends HttpException {
	constructor() {
		super(403, "Forbidden Access");
	}
}

const AuthRepository: AuthRepositoryClass = new AuthRepositoryClass();

export { AuthRepository, UnauthorizedException, ForbiddenException };
