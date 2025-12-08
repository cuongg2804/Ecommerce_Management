import { Router } from "express";
const router = Router();
import dashboardRouter from "./dashboard.router";
import articleRouter from "./article.router";
import helpers from "./helpers.router";
import file from "./file.router";
import folder from "./folder.router";
import role from "./role.router";
import account_admin from "./account-admin.router";
router.use("/dashboard",dashboardRouter);

//  [GET] /admin/article
router.use("/article",articleRouter);

//  [GET] /admin/helper
router.use("/helpers",helpers);

// [GET] /admin/file
router.use("/file",file);

// [GET] /admin/folder
router.use("/folder",folder);

// [GET] /admin/role/
router.use("/role",role);

// [GET] /admin/account-admin
router.use("/account-admin",account_admin);
export default router;