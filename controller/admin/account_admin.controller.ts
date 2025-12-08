import { Request, Response } from "express";
import slugify from "slugify";
import Role from "../../models/role.model";
import bcrypt from "bcryptjs";
import AccountAdmin from "../../models/account-admin.models";


// [GET] /admin/role/create
export const create =  async (req: Request, res: Response ) => {
  const roleList = await Role.find({
    deleted: false
  })
  
  res.render("admin/pages/account-admin/create", {
    pageTitle: "Tạo tài khoản",
    roleList: roleList
  })
}

// [POST] /admin/account-admin/create
export const createPost =  async (req: Request, res: Response ) => {
  try {
    
    req.body.password = await bcrypt.hash(req.body.password, 10);

    req.body.search = slugify(`${req.body.fullName} ${req.body.email}`,{
        lower: true,
        replacement: " "
      })
    const newRecord = new AccountAdmin(req.body);
    await newRecord.save()

    res.send({
      code: "success",
      message:"Tạo mới tài khoản thành công!"
    })
  }catch{
    res.send({
      code: "error",
      message:"Dữ liệu không hợp lệ!"
    })
  }
}