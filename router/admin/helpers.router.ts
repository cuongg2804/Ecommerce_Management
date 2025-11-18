import { Router } from "express";
import * as controller from "../../controller/admin/helpers.controller";
const router = Router();

router.post("/generateSlug",controller.generateSlug);

export default router;