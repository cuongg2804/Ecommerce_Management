import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const validatesCategory = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    name: Joi.string()
        .required()
        .messages({
          'string.empty' : "Vui lòng điền tên danh mục!"
        }),
    slug: Joi.string()
        .required()
        .messages({
          'string.empty' : "Vui lòng điền đường dẫn danh mục!"
        }),
    avatar: Joi.string()
        .required()
        .messages({
          'string.empty' : "Vui lòng chọn avatar cho danh mục!"
        }),
    status: Joi.string()
        .allow(""),
    parent: Joi.string().allow(""),
    description: Joi.string().allow("")
  })

  const value = schema.validate(req.body);
  if(value.error){
    res.json({
      code: "error",
      message: value.error?.details[0].message
    })

    return;
  }
  next();
}

export const validatesArticle = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    name: Joi.string()
        .required()
        .messages({
          'string.empty' : "Vui lòng điền tên danh mục!"
        }),
    slug: Joi.string()
        .required()
        .messages({
          'string.empty' : "Vui lòng điền đường dẫn danh mục!"
        }),
    avatar: Joi.string()
        .required()
        .messages({
          'string.empty' : "Vui lòng chọn avatar cho danh mục!"
        }),
    status: Joi.string()
        .allow(""),
    description: Joi.string().allow(""),
    content: Joi.string().allow(""),
    category: Joi.string()
        .required()
        .messages({
          'string.empty' : "Vui lòng chọn danh mục!"
        })
  })

  const value = schema.validate(req.body);
  if(value.error){
    res.json({
      code: "error",
      message: value.error?.details[0].message
    })

    return;
  }
  next();
}