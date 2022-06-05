import { Request, Response, Router } from "express";

const router = Router();

router.get("/users", [], (req: Request, res: Response) => {
  return res.send({ name: "Alex", id: "1", bio: "Frontender" });
});

export { router as appRouter };
