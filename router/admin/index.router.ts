import { Router } from "express";
const router = Router();
import dashboardRouter from "./dashboard.router";
import articleRouter from "./article.router";
import helpers from "./helpers.router";
import file from "./file.router";
import folder from "./folder.router";

router.use("/dashboard",dashboardRouter);

//  [GET] /admin/article
router.use("/article",articleRouter);

//  [GET] /admin/helper
router.use("/helpers",helpers);

// [GET] /admin/file
router.use("/file",file);

// [GET] /admin/folder
router.use("/folder",folder);

export default router;