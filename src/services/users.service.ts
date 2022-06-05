import { Request, Response } from "express";
import { IUser, UsersDocument } from "../models";

class UsersService {
  public async index(req: Request, res: Response): Promise<Response<IUser[]>> {
    try {
      const users = await UsersDocument.find({});

      return res.status(200).json(users);
    } catch (err: any) {
      return res.status(400).json({ error: err.toString() });
    }
  }

  public async show(req: Request, res: Response): Promise<Response<IUser>> {
    try {
      const user = await UsersDocument.findById(req.params.id);

      if (!user) {
        throw new Error("User not found");
      }

      return res.status(200).json(user);
    } catch (err: any) {
      return res.status(400).json({ error: err.toString() });
    }
  }

  public async create(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.body.id) {
        req.body.id = 0;
      }

      const user = await UsersDocument.create(req.body);

      return res.status(201).json(user);
    } catch (err: any) {
      return res.status(400).json({ error: err.toString() });
    }
  }

  public async update(req: Request, res: Response): Promise<Response<IUser>> {
    try {
      const user = await UsersDocument.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: false }
      );

      return res.status(200).json(user);
    } catch (err: any) {
      return res.status(400).json({ error: err.toString() });
    }
  }

  public async delete(req: Request, res: Response): Promise<Response<IUser>> {
    try {
      const user = await UsersDocument.findByIdAndRemove(req.params.id);

      if (!user) {
        throw new Error("User not found");
      }

      return res.status(200).json(user);
    } catch (err: any) {
      return res.status(400).json({ error: err.toString() });
    }
  }
}

export default new UsersService();
