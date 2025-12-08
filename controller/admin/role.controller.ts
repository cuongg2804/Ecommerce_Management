import { Request, Response } from "express";
import { permissionList } from "../../config/systemConfig";
import slugify from "slugify";
import Role from "../../models/role.model";
import { PaginationHelper } from "../../helpers/pagination.helper";

// [GET] /admin/role/create
export const create =  async (req: Request, res: Response ) => {
  res.render("admin/pages/role/create", {
    pageTitle: "Tạo nhóm quyền",
    permissionList: permissionList
  })
}

// [POST] /admin/role/create
export const createPost =  async (req: Request, res: Response ) => {
 try {
  req.body.permissions = JSON.parse(req.body.permissions)

  req.body.search = slugify(`${req.body.name }`,{
    lower: true,
    replacement: " "
  })

  const newRecord = new Role(req.body);
  await newRecord.save()
  
  res.send({
    code: "success",
    message: "Tạo mới nhóm quyền thành công!"
  })
 } catch (error) {
  res.send({
    code: "error",
    message: "Tạo mới nhóm quyền thất bại!"
  })
 }
}

// [GET] /admin/role/list
export const list =  async (req: Request, res: Response ) => {

   const find : {
          deleted: boolean,
          search?: RegExp
      } =  ({
          deleted: false
      })
  
      if(req.query.keyword){
          const keyword = slugify(`${req.query.keyword}`,{
              lower: true,
              replacement: " "
          })
          const keywordRegex = new RegExp(keyword,"i");
  
          find.search = keywordRegex;
      }
  
      //Pagination
      const totalRecord = await Role.countDocuments(find);
      const pagination = PaginationHelper(req, totalRecord,2);
      //Pagination
  
      const roleList = await Role
                                  .find(find)
                                  .limit(pagination.limit)
                                  .skip(pagination.skip ?? 0)                     
                                  .sort({
                                      createdAt: "desc"
                                  })
  

  res.render("admin/pages/role/list", {
    pageTitle: "Danh sách nhóm quyền",
    roleList: roleList,
    pagination: pagination
  })
}

// [GET] /admin/role/edit/:id
export const edit =  async (req: Request, res: Response ) => {

  const role = await Role.findOne({
    _id : req.params.id,
    deleted : false
  })
  
  res.render("admin/pages/role/edit", {
    pageTitle: "Chỉnh sửa nhóm quyền",
    permissionList: permissionList,
    role: role
  })
}

// [patch] /admin/role/edit/:id
export const editPatch =  async (req: Request, res: Response ) => {
  try {
    req.body.permissions = JSON.parse(req.body.permissions)

    req.body.search = slugify(`${req.body.name }`,{
      lower: true,
      replacement: " "
    })
    
    await Role.updateOne({
      _id: req.params.id,
      deleted: false
    },req.body)
  
    res.send({
      code:"success",
      message: "Chỉnh sửa nhóm quyền thành công"
    })
  } catch (error) {
    res.send({
      code:"error",
      message: "Chỉnh sửa nhóm quyền thất bại"
    })
  }
}

// PATCH /admin/role/delete/:id
export const deletePatch =  async (req: Request, res: Response ) => {
  try {
    
    await Role.updateOne({
      _id: req.params.id
    },{
      deleted: true,
      deletedAt: Date.now()
    })
  
    res.send({
      code:"success",
      message: "Xóa nhóm quyền thành công"
    })
  } catch (error) {
    res.send({
      code:"error",
      message: "Xóa nhóm quyền thất bại"
    })
  }
}