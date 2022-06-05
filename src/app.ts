import { json } from "body-parser";
import express from "express";
import { appRouter } from "./routes";

class App {
  public express!: express.Application;
  public apiPrefix = process.env.API_PREFIX || "/api";

  constructor() {
    this.express = express();

    this.middlewares();
    this.routes();
  }

  private middlewares(): void {
    this.express.use(json());
  }

  private routes(): void {
    this.express.use(this.apiPrefix, appRouter);
  }

  public listen(port: string): void {
    this.express.listen(port, () => {
      console.log("server is running on port " + port);
    });
  }
}

export default new App();
