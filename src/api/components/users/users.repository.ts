import { Request, Response } from "express";
import { User } from "./user.model";
import { UsersModel } from "./users.schema";

class UsersRepositoryClass {
  public async index(req: Request, res: Response): Promise<Response<User[]>> {
    try {
      const users = await UsersModel.find({});

      return res.status(200).json(users);
    } catch (err: any) {
      return res.status(400).json({ error: err.toString() });
    }
  }

  public async show(req: Request, res: Response): Promise<Response<User>> {
    try {
      const user = await UsersModel.findById(req.params.id);

      if (!user) {
        throw new Error("User not found");
      }

      return res.status(200).json(user);
    } catch (err: any) {
      return res.status(400).json({ error: err.toString() });
    }
  }

  public async create(req: Request, res: Response): Promise<Response<User>> {
    try {
      if (!req.body.id) {
        req.body.id = 0;
      }

      const user = await UsersModel.create(req.body);

      return res.status(201).json(user);
    } catch (err: any) {
      return res.status(400).json({ error: err.toString() });
    }
  }

  public async update(req: Request, res: Response): Promise<Response<User>> {
    try {
      const user = await UsersModel.findByIdAndUpdate(req.params.id, req.body, {
        new: false,
      });

      if (!user) {
        throw new Error("User not found");
      }

      return res.status(200).json(user);
    } catch (err: any) {
      return res.status(400).json({ error: err.toString() });
    }
  }

  public async delete(
    req: Request,
    res: Response
  ): Promise<Response<{ deletedUser: User }>> {
    try {
      const user = await UsersModel.findByIdAndRemove(req.params.id);

      if (!user) {
        throw new Error("User not found");
      }

      return res.status(200).json({ deletedUser: user });
    } catch (err: any) {
      return res.status(400).json({ error: err.toString() });
    }
  }
}

const UsersRepository: UsersRepositoryClass = new UsersRepositoryClass();

export { UsersRepository };
