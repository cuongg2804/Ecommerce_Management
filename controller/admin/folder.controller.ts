import express, {Request, Response} from 'express';
import FormData from "form-data" ;
import axios from "axios";
import Media from "../../models/media";
import moment from 'moment';
import {formatFileSize} from "../../helpers/formatSize.helper";
import { PaginationHelper } from '../../helpers/pagination.helper';
import { domainCDN } from '../../config/systemConfig';

export const createFolder = async (req: Request, res: Response) =>{
  try{
    const { folderName, folderPath } = req.body;
    if(!folderName){
      res.json({
        code: "error",
        message: `Thiếu tên thư mục !`
      })
      return;
    }
    
    const formData = new FormData();
    formData.append("folderName", folderName);

    if(folderPath){
      formData.append("folderPath", folderPath);
    } 
    
    const response = await axios.post(`${domainCDN}/file-manager/folder/create`, formData, {
      headers: formData.getHeaders(),
    });

    if(response.data.code == "error") {
      res.json({
        code: "error",
        message: response.data.message
      })
      return;
    }
    
    res.json({
      code: "success",
      message: "Đã tạo folder!"
    })

  }
  catch{
    res.json({
      code: "error",
      message: `Tạo mới folder thất bại !`
    })
  }
}

// [DELETE] /admin/folder/delete
export const deleteFolder = async (req: Request, res: Response) =>{
  try{
    const folderPath = req.query.folderPath
   
    
    if(!folderPath){
      res.json({
        code: "error",
        message:"Folder không hợp lệ!"
      })
      return;
    }

    const formData = new FormData();
    formData.append("folderPath",folderPath);
    const response = await axios.patch(`${domainCDN}/file-manager/folder/delete`, formData, {
      headers: formData.getHeaders()
    })

    

    if(response.data.code == "error") {
      res.json({
        code: "error",
        message: response.data.message
      })
      return;
    }

    const regexFolderPath = new RegExp(`${folderPath}`);
    await Media.deleteMany({
      folder: regexFolderPath
    });

    res.json({
      code: "success",
      message: "Xóa folder thành công!"
    })
  }
  catch{
    res.json({
      code: "error",
      message:"Xảy ra lỗi trong quá trình xử lí"
    })
  }
}