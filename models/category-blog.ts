
import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: String,
    parent: String,
    slug: String,
    avatar: String,
    status: {
      type: String,
      enum: ["active",  "inactive"],
      default: "active"
    },
    view: {
      type: Number,
      default: 0
    },
    search: String,
    description: String,
    deleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date
  },
  {
    timestamps: true
  }
);

const CategoryBlog = mongoose.model("CategoryBlog", schema,
  "category-blog"
);

export default CategoryBlog;