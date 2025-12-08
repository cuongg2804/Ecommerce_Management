import { Router } from "express";
import * as controller from "../../controller/admin/file.controller";
const router = Router();
import multer from 'multer';
const upload = multer();

router.get("/",controller.index);

router.get("/iframe",controller.iframe);

// [POST] file/upload
router.post("/upload", upload.array('files'), controller.uploadFile);

//  [PATCH] /admin/file/change-file-name
router.patch("/change-file-name", upload.none(), controller.changeFileName);

//  [PATCH] /admin/file/delete-file-name/:id
router.patch("/delete-file/:id", upload.none(), controller.deleteFile);

// PATCH /admin/role/delete/:id

export default router;