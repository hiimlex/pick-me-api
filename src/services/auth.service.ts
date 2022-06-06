import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { User } from "../models";
import { TOKEN_SECRET, UsersModel } from "../schemas";

class AuthenticationService {
  public async login(
    req: Request,
    res: Response
  ): Promise<Response<{ token: string }>> {
    try {
      const { email, password } = req.body;

      const user = await UsersModel.findByCredentials(email, password);

      if (!user) {
        throw new Error("403");
      }

      const token = await user.generateAuthToken();

      if (!token) {
        return res.status(500).json({ error: "Failed to generate token" });
      }

      return res.status(200).json({ accessToken: token });
    } catch (err: any) {
      if (err === "403") {
        return res.status(403).json({ error: "Invalid credentials" });
      }

      return res.status(500).json({ error: err.toString() });
    }
  }

  public async currentUser(
    req: Request,
    res: Response
  ): Promise<Response<User>> {
    try {
      let token = req.header("Authorization");

      if (!token) {
        throw new Error("401");
      }

      token = token.replace("Bearer", "").trim();

      const user = await UsersModel.findOne({
        accessToken: token,
      });

      if (!user) {
        throw new Error("401");
      }

      return res.status(200).json({ ...user.toJSON(), token });
    } catch (err: any) {
      if (err === "401") {
        return res.status(err).json({ error: "Invalid token" });
      }

      return res.status(500).json({ error: "Failed to get the current user" });
    }
  }

  public async verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      let token = req.headers.authorization;

      if (!token) {
        throw new Error("401");
      }

      token = token.replace("Bearer", "").trim();

      let decoded: any = jwt.verify(token, TOKEN_SECRET);

      if (!decoded) {
        throw new Error("401");
      }

      next();
    } catch (err: any) {
      if (err === "401") {
        return res.status(err).json({ error: "Invalid token" });
      }

      return res.status(500).json({ error: "Failed to authenticate the user" });
    }
  }
}

export default new AuthenticationService();
