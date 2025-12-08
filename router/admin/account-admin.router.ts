import { Router } from "express";
import * as controller from "../../controller/admin/account_admin.controller";
import * as validate from "../../validates/admin/account-admin.validate";
const router = Router();
import multer from 'multer';
const upload = multer();

// [GET] /admin/account-admin/create
router.get("/create",controller.create)

// [POST] /admin/account-admin/create
router.post("/create",upload.none(),validate.validatesCreateAccountAdmin, controller.createPost)

export default router ; 