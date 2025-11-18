import { Request, Response } from "express";
import CategoryBlog from "../../models/category-blog";
import { categoryBlogTree } from "../../helpers/category.helper";
import slugify from "slugify";
import { date } from "joi";
import { PaginationHelper } from "../../helpers/pagination.helper";

// [GET] /admin/article/category
export const category = async (req : Request, res: Response) => {
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
    const totalRecord = await CategoryBlog.countDocuments(find);
    const pagination = PaginationHelper(req, totalRecord,2);
    //Pagination

    const categoryList = await CategoryBlog
                                .find(find)
                                .limit(pagination.limit)
                                .skip(pagination.skip ?? 0)                              
                                .sort({
                                    createdAt: "desc"
                                })
    
    res.render("admin/pages/article/category",{
        pageTitle: "Quản lý danh mục",
        categoryList : categoryList,
        pagination: pagination
    });
}

// [GET] /admin/article/category/create
export const categoryCreate = async (req : Request, res: Response) => {
    const categoryList = await CategoryBlog.find({});
    const categoryTree = categoryBlogTree(categoryList);
  
    res.render("admin/pages/article/category-create.pug",{
        pageTitle: "Tạo mới danh mục",
        categoryList: categoryList,
        categoryTree: categoryTree
    });
}

// [POST] /admin/article/category/create
export const categoryCreatePost = async (req : Request, res: Response) => {
    try{
        const existSlug = await CategoryBlog.findOne({
            slug: req.body.slug
        })
        
        if(existSlug) {
            res.send({
                code: "error",
                message : 'Đường dẫn đã tồn tại!'
            }); 
            return;
        }
        req.body.search = slugify(req.body.name, {
            lower: true,
            replacement: " "
        })
      
        const newCategoryBlog = new CategoryBlog(req.body);
        await newCategoryBlog.save();
        res.send({
            code: "success",
            message : 'Tạo mới danh mục thành công!'
        });
    }
    catch(error){
        res.send({
            code: "error",
            message : 'Dữ liệu không hợp lệ!'
            
        });
        return;
    }
}

// [GET] /admin/article/category/edit/:id
export const categoryEdit = async (req: Request, res: Response) =>{
    const categoryList = await CategoryBlog.find({});
    const categoryTree = categoryBlogTree(categoryList);
    const id = req.params.id;

    const category = await CategoryBlog.findOne({
        _id : id
    })
    res.render("admin/pages/article/category-edit",{
        pageTitle: "Quản lý danh mục",
        categoryTree : categoryTree,
        category : category
    });
}

// [PATCH] /admin/article/category/edit/:id

export const categoryEditPatch = async (req: Request, res: Response) =>{
    try{
        const existSlug = await CategoryBlog.findOne({
        slug: req.body.slug,
            _id: { $ne: req.params.id }
        })
        
        if(existSlug) {
            res.send({
                code: "error",
                message : 'Đường dẫn đã tồn tại!'
            }); 
            return;
        }

        req.body.search = slugify(req.body.name,{
            lower: true,
            replacement: " "
        })

        await CategoryBlog.updateOne({
            _id : req.params.id
        },req.body)

        res.json({
            code: "success",
            message: "Chỉnh sửa danh mục thành công!"
        })
    }
    catch{
        res.json({
            code: "error",
            message: "Dữ liệu không hợp lệ!"
        })
    }
}

// [PATCH] /admin/article/category/delete/:id
export const categoryDeletePatch = async (req: Request, res: Response) =>{
    try{
        
        await CategoryBlog.updateOne({
            _id : req.params.id
        },{
            deleted: true,
            deletedAt: Date.now()
        })

        res.json({
            code: "success",
            message: "Xóa danh mục thành công!"
        })
    }
    catch{
        res.json({
            code: "error",
            message: "Dữ liệu không hợp lệ!"
        })
    }
}

// [GET] /admin/article/category/trash
export const categoryTrash = async (req: Request, res: Response) =>{ 
    const find =  ({
        deleted: true
    })

    const categoryList = await CategoryBlog.find(find)
    res.render("admin/pages/article/category-trash",{
        pageTitle: "Thùng rác danh mục",
        categoryList : categoryList
    });
}

// [PATCH] /admin/article/category/recovery
export const categoryRecovery = async (req: Request, res: Response) =>{
    try{
        
        await CategoryBlog.updateOne({
            _id : req.params.id
        },{
            deleted: false
        })

        res.json({
            code: "success",
            message: "Khôi phục danh mục thành công!"
        })
    }
    catch{
        res.json({
            code: "error",
            message: "Dữ liệu không hợp lệ!"
        })
    }
}

export const categoryDestroy = async (req: Request, res: Response) =>{
    try{
        
        await CategoryBlog.deleteOne({
            _id : req.params.id
        })

        res.json({
            code: "success",
            message: "Xóa vĩnh viễn danh mục thành công!"
        })
    }
    catch{
        res.json({
            code: "error",
            message: "Dữ liệu không hợp lệ!"
        })
    }
}