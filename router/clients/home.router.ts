import { Router } from "express";
import * as controller from "../../controller/client/home.controller";
const router = Router();

router.get("/",controller.home);

export default router;