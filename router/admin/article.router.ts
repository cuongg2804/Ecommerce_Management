import { Router } from "express";
const router = Router();
import multer from 'multer';
const upload = multer();
import * as controller from "../../controller/admin/article.controller";
import * as validates from "../../validates/admin/article.validate";

// [GET] /admin/article/category
router.get("/category",controller.category);

// [GET] /admin/article/category/create
router.get("/category/create",controller.categoryCreate);

// [POST] /admin/article/category/create
router.post("/category/create",upload.none(), validates.validatesCategory ,controller.categoryCreatePost)

// [GET] /admin/article/category/edit/:id
router.get("/category/edit/:id",controller.categoryEdit);

// [PATCH] /admin/article/category/edit/:id
router.patch("/category/edit/:id",upload.none(), validates.validatesCategory,controller.categoryEditPatch);

// [PATCH] /admin/article/category/delete/:id
router.patch("/category/delete/:id",controller.categoryDeletePatch);

// [PATCH] /admin/article/category/trash
router.get("/category/trash",controller.categoryTrash);

// [PATCH] /admin/article/category/recovery
router.patch("/category/recovery/:id",controller.categoryRecovery);

// [DELETE] /admin/article/category/destroy/:id
router.delete("/category/destroy/:id",controller.categoryDestroy);

export default router;