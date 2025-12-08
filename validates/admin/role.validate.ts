import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const validatesRole = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    name: Joi.string()
        .required()
        .messages({
          'string.empty' : "Vui lòng điền tên danh mục!"
        }),
    description: Joi.string().allow(''),
    permissions: Joi.string().allow(''),
    status: Joi.string().allow('')

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