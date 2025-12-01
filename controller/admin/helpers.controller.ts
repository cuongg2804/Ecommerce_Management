import express, {Request, Response} from 'express';
import slugify from 'slugify';
import CategoryBlog from '../../models/category-blog';
import Blog from '../../models/blog';
import { generateRandomString } from '../../helpers/generate.helper';
import mongoose from 'mongoose';
import { exist } from 'joi';

const models: any= {
  CategoryBlog: CategoryBlog,
  Blog: Blog
}

export const generateSlug = async (req: Request, res: Response) => {
  try{
    console.log(req.body.modelName);
    if(req.body["string"] == ''){
      res.json({
        type: "error",
        message: "Chưa điền tên danh mục!"
      })
      return;
    }
    const model = models[req.body.modelName];
    let slug = slugify(req.body["string"], {
        replacement: '-',  
        lower: true,    
        strict: true,     
    })

    const existSlug = await model.findOne({
      slug : slug
    })
    if(existSlug) {
      const randomSlug = generateRandomString();
      slug = `${slug}-${randomSlug}`;
    }
    res.json({
      type: "success",
      message: "Tạo được dẫn thành công!",
      slug: slug
    })
    return ;
  }
  catch(error){
    res.json({
      type: "error",
      message: "Model không hợp lệ!"
    })
    return;
  }
}

