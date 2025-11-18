import { Router } from "express";
import homeRouter from "./home.router";
const router = Router();

router.use("/",homeRouter);

export default router;