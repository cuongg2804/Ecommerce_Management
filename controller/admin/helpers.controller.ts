import express, {Request, Response} from 'express';
import slugify from 'slugify';
import CategoryBlog from '../../models/category-blog';
import { generateRandomString } from '../../helpers/generate.helper';
import mongoose from 'mongoose';

export const generateSlug = async (req: Request, res: Response) => {

  if(req.body["string"] == ''){
    res.json({
      type: "error",
      message: "Chưa điền tên danh mục!"
    })
    return;
  }

  const model = mongoose.model(req.body["modelName"]);
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
}