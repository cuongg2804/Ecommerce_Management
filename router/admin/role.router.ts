import { Router } from "express";
import * as controller from "../../controller/admin/role.controller";
import * as validates from "../../validates/admin/role.validate";
const router = Router();
import multer from 'multer';
const upload = multer();

// [GET] /admin/role/create
router.get("/create",controller.create)

// [POST] /admin/role/create
router.post("/create",upload.none(),validates.validatesRole,controller.createPost)

// [GET] /admin/role/list
router.get("/list",controller.list);

// [GET] /admin/role/edit/:id
router.get("/edit/:id",controller.edit);

// [patch] /admin/role/edit/:id
router.patch("/edit/:id",upload.none(),validates.validatesRole, controller.editPatch);

// PATCH /admin/role/delete/:id
router.patch("/delete/:id",controller.deletePatch);

export default router ; 