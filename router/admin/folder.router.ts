import { Router } from "express";
import * as controller from "../../controller/admin/folder.controller";
const router = Router();
import multer from 'multer';
const upload = multer();

// [POST] /admin/folder/create
router.post("/create",upload.none(), controller.createFolder);

// [DELETE] /admin/folder/delete
router.delete("/delete",upload.none(), controller.deleteFolder);

export default router;