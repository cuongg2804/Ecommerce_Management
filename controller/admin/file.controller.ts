import express, {Request, response, Response} from 'express';
import FormData from "form-data" ;
import axios from "axios";
import Media from "../../models/media";
import moment from 'moment';
import {formatFileSize} from "../../helpers/formatSize.helper";
import { PaginationHelper } from '../../helpers/pagination.helper';
import { domainCDN } from '../../config/systemConfig';
import path from 'path';

export const index = async (req: Request, res: Response) =>{
  const find:{folder?: string} = {};

  let folderPath = "media";

  if(req.query.folderPath){
    folderPath = path.join(folderPath, `${req.query.folderPath}`);
    
  }
  find.folder = `${folderPath}`;
  //Pagination 
  const countRecord = await Media.countDocuments();
  const pagination = PaginationHelper(req, countRecord, 4);
  //Pagination

  const mediaList : any = await Media.find(find)
                                .limit(pagination.limit)
                                .skip(pagination.skip ?? 0)
                                .sort({createAt: "desc"});

  for(const item of mediaList) {
    item.createdFormatAt = moment(item.createdAt).format("HH:mm - DD/MM/YYYY");
    item.sizeFormat = formatFileSize(item.size);
  }

  let folderList: any = [];
  const response = await axios.get(`${domainCDN}/file-manager/folder/list?folderPath=${req.query.folderPath}`);
  
  folderList = response.data.folderList || "";
  if(folderList){
     for(let item of folderList){
      item.createdAtFormat = moment(item.createdAt).format("HH:mm DD-MM-YYYY");
      
    }
  }
 
 
  res.render("admin/pages/file/iframe_file",{
    mediaList: mediaList,
    pagination: pagination,
    folderList: folderList,
   
  });
}

export const iframe =  async (req: Request, res: Response) =>{
  res.render("admin/pages/file/index",{
     pageTitle: "Quản lý file"
  })
}

// [POST] file/upload
export const uploadFile = async (req: Request, res: Response) =>{
  try{
    const formData = new FormData();
    const files = req.files as Express.Multer.File[];

    files?.forEach(file => {
      formData.append("files", file.buffer,
      {
        filename: file.originalname,
        contentType: file.mimetype
      })
    });
    
    const respone = await axios.post(`${domainCDN}/upload?folderPath=${req.query.folderPath}`, formData);
    if(respone.data.code == "success") {
      await Media.insertMany(respone.data.saveLinks);
      res.json({
        code: "success",
        message: "Upload thành công!"
      })
    }
    else{
      res.json({
        code: "error",
        message: "Upload thất bại!"
      })
    }
  }
  catch{
    res.json({
      code: "error",
      message: "Upload thất bại!"
    })
  }
}

// [PATCH] file/changeFileName
export const changeFileName = async (req: Request, res: Response) =>{ 
  try{
    const file = await Media.findOne({
      _id: req.body.id
    })

    if(!file){
      res.json({
        code: "error",
        message: "Không tìm thấy file!"
      })
    }

    const formData = new FormData();
    formData.append("folder",file?.folder);
    formData.append("fileName",file?.filename);
    formData.append("newName",req.body.name);

    const respone = await axios.patch(`${domainCDN}/file-manager/change-file-name`, formData);
    
    if(respone.data.type == "error") {
      res.json({
        code: "error",
        message: respone.data.message
      })
      return ;
    }

    await Media.updateOne({
      _id : req.body.id
    },{
      filename: req.body.name
    })
    res.json({
      code: "success",
      message: "Thay đổi thành công !"
    })
  }
  catch {
    res.json({
      code: "error",
      message: "Thay đổi thất bại!"
    })
  }
}


export const deleteFile = async (req: Request, res: Response) =>{ 
   try{
  
    const file = await Media.findOne({
      _id: req.body.id
    })

    if(!file){
      res.json({
        code: "error",
        message: "Không tìm thấy file!"
      })
    }

    const formData = new FormData();
    formData.append("folder",file?.folder);
    formData.append("fileName",file?.filename);

    const respone = await axios.patch(`${domainCDN}/file-manager/delete-file`, formData);
    
    if(respone.data.type == "error") {
      res.json({
        code: "error",
        message: respone.data.message
      })
      return ;
    }

    await Media.deleteOne({
      _id : req.body.id
    })
    res.json({
      code: "success",
      message: `Xóa file thành công !`
    })
  }
  catch {
    res.json({
      code: "error",
      message: `Xóa file thất bại !`
    })
  }
}