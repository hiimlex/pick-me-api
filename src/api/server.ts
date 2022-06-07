import { json } from "body-parser";
import express from "express";
import connection from "../../db/connection";
import appRouter from "./router";

class Server {
   express!: express.Application;
   apiPrefix = process.env.API_PREFIX || "/api";

  constructor() {
    this.express = express();

    this.middlewares();
    this.routes();
    this.connectDB();
  }

  private async connectDB() {
    try {
      await connection.then(() => {
        console.log("Database is connected");
      });
    } catch (err: any) {
      throw new Error(err);
    }
  }

  private middlewares(): void {
    this.express.use(json());
  }

  private routes(): void {
    appRouter(this.express);
  }

   listen(port: string | number): void {
    this.express.listen(port, () => {
      console.log("server is running on port " + port);
    });
  }
}

export { Server };
