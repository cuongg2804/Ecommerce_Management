import { Request, Response } from "express";
import CategoryBlog from "../../models/category-blog";
import Blog from "../../models/blog";
import { categoryBlogTree } from "../../helpers/category.helper";
import slugify from "slugify";
import { date } from "joi";
import { PaginationHelper } from "../../helpers/pagination.helper";
import { prefixAdmin } from "../../config/systemConfig";
import { blob } from "stream/consumers";


// [GET] /admin/article/list
export const articleList = async (req : Request, res: Response) => {
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
    const totalRecord = await Blog.countDocuments(find);
    const pagination = PaginationHelper(req, totalRecord,2);
    //Pagination

    const articleList = await Blog
                                .find(find)
                                .limit(pagination.limit)
                                .skip(pagination.skip ?? 0)                     
                                .sort({
                                    createdAt: "desc"
                                })

    res.render("admin/pages/article/list",{
        pageTitle: "Danh sách bài viết",
        articleList : articleList,
        pagination: pagination
    });
}
// [GET] /admin/article/create
export const articleCreate = async (req : Request, res: Response) => {

    const categoryList = await CategoryBlog.find({});
    const categoryTree = categoryBlogTree(categoryList);
  
    res.render("admin/pages/article/create",{
        pageTitle: "Tạo mới bài viết",
        categoryList: categoryList,
        categoryTree: categoryTree
    });
}

// [POST] /admin/article/create
export const articleCreatePost = async (req : Request, res: Response) => {
    try {
        
        const existSlug = await Blog.findOne({
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
        req.body.category = JSON.parse(req.body.category);

        if(req.body.status == "published"){
            req.body.publishAt = new Date();
        }

        const newBlog = new Blog(req.body);
        await newBlog.save();
        res.json({
            code: "success",
            message: "Tạo mới bài viết thành công"
        })
    } catch (error) {
        res.json({
            code: "error",
            message: "Tạo mới bài viết thất bại"
        })
    }
}

// [GET] /admin/article/edit/:id
export const articleEdit = async (req : Request, res: Response) => {
    try {
        
        const categoryList = await CategoryBlog.find({});
        const categoryTree = categoryBlogTree(categoryList);

        const articleDetail = await Blog.findOne({
            _id : req.params.id,
            deleted: false
        })

        if(!articleDetail){
            res.redirect(`${prefixAdmin}/article/list`)
            return;
        }
        
        res.render("admin/pages/article/article-edit",{
            pageTitle: "Chỉnh sửa bài viết",
            categoryList: categoryTree,
            articleDetail: articleDetail
        })
        
    } catch (error) {
        res.redirect(`${prefixAdmin}/article/list`);
    }
}

// [PATCH] /admin/article/edit/id
export const articleEditPatch = async (req : Request, res: Response) => {
    try {
        const id = req.params.id;
        const articleDetail = await Blog.findOne({
            _id: id,
            deleted: false
        })

        if(!articleCreate){
            res.json({
                code: "error",
                message: "Bài viết không tồn tại"
            })
            return;
        }

        const existSlug = await Blog.findOne({
            _id: { $ne: id},
            slug : req.body.slug
        })

        if(existSlug){
            res.json({
                code: "error",
                message: "Đường dẫn đã tồn tại!"
            })
            return;
        }

        req.body.category = JSON.parse(req.body.category);

        req.body.search = slugify(`${req.body.name}`, {
            replacement: " ",
            lower: true
        });

        if(req.body.status == "published"){
            req.body.updateAt = new Date();
        }

        await Blog.updateOne({
            _id : id,
            deleted: false
        }, req.body)

        res.json({
            code: "success",
            message: "Cập nhật bài viết thành công!"
        })
        res.redirect(`${prefixAdmin}/article/list`)

    } catch (error) {
        res.json({
            code: "error",
            message: "Bài viết không tồn tại"
        })
        return;
    }
}

// [DELETE] /admin/article/delete/:id
export const articleDelete = async (req : Request, res: Response) => {
    try {
        await Blog.updateOne({
            _id: req.params.id
        },{
            deleted: true,
            deleteAt: Date.now()
        })
        res.json({
            code: "success",
            message: "Xóa bài viết thành công!"
        })
        return;
    } catch (error) {
        res.json({
            code: "error",
            message: "Xóa bài viết không thành công!"
        })
        return;
    }
}

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
    
    res.render("admin/pages/article/category/category",{
        pageTitle: "Quản lý danh mục",
        categoryList : categoryList,
        pagination: pagination
    });
}

// [GET] /admin/article/category/create
export const categoryCreate = async (req : Request, res: Response) => {
    const categoryList = await CategoryBlog.find({});
    const categoryTree = categoryBlogTree(categoryList);
  
    res.render("admin/pages/article/category/category-create.pug",{
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
    res.render("admin/pages/article/category/category-edit",{
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
    res.render("admin/pages/article/category/category-trash",{
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