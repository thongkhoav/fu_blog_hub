import { Request, Response, NextFunction, raw } from "express";
import * as base from "./baseController";
import { IBlog } from "../models/blogModel";
import AppError from "../utils/appError";
const Blog = require("../models/blogModel");
const Tag = require("../models/tagModel");
const BlogSeries = require("../models/blogSeriesModel");

const BlogState = {
  PUBLIC: "public",
  REMOVED: "removed",
  WAITING: "waiting",
  DRAFT: "draft",
  REJECTED: "rejected",
};

export const createBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      title,
      thumbnail,
      description,
      contentRaw,
      blogSeriesId,
      status,
      blogCateId,
      tags,
    } = req.body;
    const user = (req as any).user;
    let blogSeries = null;
    // return res.json({"status": "OK"})

    // Kiểm tra xem blogseries đó có tồn tại hay không, nếu có thì nó có phải blogseries của nguoi đăng không
    if (blogSeriesId) {
      blogSeries = await BlogSeries.findById(blogSeriesId);
      if (!blogSeries) {
        const error = new AppError(403, "fail", "BlogSeries is not exist");
        next(error);
      }

      if (blogSeries.userId.toString() !== user._id.toString()) {
        const error = new AppError(403, "fail", "Invalid BlogSeries");
        next(error);
      }
    }

    // Bài viết mới tạo sẽ có thể là daft hoặc watting
    // Đoạn này BlogState đang = undefined
    if (status && status !== BlogState.DRAFT && status !== BlogState.WAITING) {
      const error = new AppError(403, "fail", "Invalid status");
      next(error);
    }

    const tagIds: Array<String> = [];

    for (const tag of tags) {
      // Kiểm tra xem tag có quá dài hay không
      if (tag.length > 20) {
        const error = new AppError(403, "fail", "Tag is too long");
        return next(error);
      }

      // Kiểm tra xem tag có chứa kí tự đặc biệt hay không
      const regex = /^[a-zA-Z0-9]+$/;
      if (!regex.test(tag)) {
        const error = new AppError(403, "fail", "Tag is not valid");
        return next(error);
      }

      const lowercasedTag = tag.toLowerCase();
      try {
        // Tìm tag trong cơ sở dữ liệu
        let tagExist = await Tag.findOne({ name: lowercasedTag });

        if (tagExist) {
          tagExist.numBlog += 1;
          await tagExist.save();
          tagIds.push(tagExist._id);
        } else {
          // Nếu tag không tồn tại, tạo mới
          const newTag = await Tag.create({ name: lowercasedTag });
          newTag.numBlog = 1;
          await newTag.save();
          tagIds.push(newTag._id);
        }
      } catch (error) {
        // Xử lý lỗi nếu có
        return next(error);
      }
    }

    const blog: IBlog = await Blog.create({
      title,
      description,
      contentRaw,
      thumbnail,
      userId: user._id,
      blogSeriesId: blogSeriesId ? blogSeriesId : null,
      status,
      blogCateId,
      tagIds,
    });

    // Cập nhật số lượng trong blogseries
    if (blogSeries) {
      blogSeries.numBlog += 1;
      blogSeries.save();
    }

    res.status(200).json({
      status: "success",
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

export const getOneBlog = base.getOne(Blog);

export const getOnePublicBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const blogPopulate = await Blog.findById(req.params.id)
      .populate({
        path: "userId",
        select: ["fullName", "avatar", "_id"],
      })
      .populate({
        path: "blogCateId",
        select: ["_id", "name"],
      })
      .populate({
        path: "blogTagIds",
        select: ["_id", "name"],
      });

    res.status(200).json({
      status: "success",
      data: blogPopulate,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPublicBlogs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const blogPopulate = await Blog.find({ status: BlogState.PUBLIC })
      .select("-contentRaw")
      .populate({
        path: "userId",
        select: ["fullName", "avatar", "_id"],
      })
      .populate({
        path: "blogCateId",
        select: "name",
      })
      .populate({
        path: "blogTagIds",
        select: ["_id", "name"],
      });
    // const blogWithTags = await Blog.aggregate([
    //   {
    //     $lookup: {
    //       from: "blogtags", // Tên của collection cho BlogTag model
    //       localField: "_id", // Trường trong collection "Blog" để so khớp
    //       foreignField: "blogId", // Trường trong collection "BlogTag" để so khớp
    //       as: "tags", // Tên của trường trong kết quả là "tags"
    //     },
    //   },
    //   {
    //     $unwind: "$tags", // Mở rộng các kết quả từ trường "tags"
    //   },
    //   {
    //     $lookup: {
    //       from: "tags", // Tên của collection cho Tag model
    //       localField: "tags.tagId", // Trường trong collection "BlogTag" để so khớp với _id trong collection "Tag"
    //       foreignField: "_id",
    //       as: "tags.tagInfo", // Tên của trường trong kết quả là "tagInfo"
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: "$_id", // Gom nhóm kết quả theo _id của Blog
    //       tags: {
    //         $push: {
    //           _id: "$tags.tagInfo._id",
    //           name: "$tags.tagInfo.name",
    //         }, // Đưa thông tin của các Tag vào một mảng "tags"
    //       },
    //       // Bạn có thể thêm các trường khác của Blog vào đây nếu cần
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 1,
    //       tags: 1,
    //       // Bạn có thể chọn các trường của Blog mà bạn muốn bao gồm ở đây
    //     },
    //   },
    // ]);

    // Gộp kết quả từ 2 mảng trên lại với nhau
    // lấy tag gắn qua, nếu lấy theo index mà id của blog với id của blogtag khác nhau thì find lại
    // const result = blogPopulate.map((blog: any, index: any) => {
    //   let blogTag = blogWithTags[index];

    //   if (blogTag._id.toString() !== blog._id.toString()) {
    //     blogTag = blogWithTags.find(
    //       (item: any) => item._id.toString() === blog._id.toString()
    //     );
    //   }

    //   return {
    //     ...blog._doc,
    //     tags: blogTag.tags,
    //   };
    // });

    res.status(200).json({
      status: "success",
      results: blogPopulate.length,
      data: blogPopulate,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPublicBlogs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const blogPopulate = await Blog.find({ status: "public" })
      .populate({
        path: "userId",
        select: ["fullName", "avatar", "_id"],
      })
      .populate({
        path: "blogCateId",
        select: "name",
      });

    const blogWithTags = await Blog.aggregate([
      {
        $lookup: {
          from: "blogtags", // Tên của collection cho BlogTag model
          localField: "_id", // Trường trong collection "Blog" để so khớp
          foreignField: "blogId", // Trường trong collection "BlogTag" để so khớp
          as: "tags", // Tên của trường trong kết quả là "tags"
        },
      },
      {
        $unwind: "$tags", // Mở rộng các kết quả từ trường "tags"
      },
      {
        $lookup: {
          from: "tags", // Tên của collection cho Tag model
          localField: "tags.tagId", // Trường trong collection "BlogTag" để so khớp với _id trong collection "Tag"
          foreignField: "_id",
          as: "tags.tagInfo", // Tên của trường trong kết quả là "tagInfo"
        },
      },
      {
        $group: {
          _id: "$_id", // Gom nhóm kết quả theo _id của Blog
          tags: {
            $push: {
              _id: "$tags.tagInfo._id",
              name: "$tags.tagInfo.name",
            }, // Đưa thông tin của các Tag vào một mảng "tags"
          },
          // Bạn có thể thêm các trường khác của Blog vào đây nếu cần
        },
      },
      {
        $project: {
          _id: 1,
          tags: 1,
          // Bạn có thể chọn các trường của Blog mà bạn muốn bao gồm ở đây
        },
      },
    ]);

    // Gộp kết quả từ 2 mảng trên lại với nhau
    // lấy tag gắn qua, nếu lấy theo index mà id của blog với id của blogtag khác nhau thì find lại
    const result = blogPopulate.map((blog: any, index: any) => {
      let blogTag = blogWithTags[index];

      if (blogTag._id.toString() !== blog._id.toString()) {
        blogTag = blogWithTags.find(
          (item: any) => item._id.toString() === blog._id.toString()
        );
      }

      return {
        ...blog._doc,
        tags: blogTag.tags,
      };
    });

    res.status(200).json({
      status: "success",
      results: result.length,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBlog = base.updateOne(Blog);

export const checkBlogOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return next(new Error("No blog found with that id"));
    }

    if (blog.userId.toString() !== (req as any).user._id.toString()) {
      return next(new Error("You are not authorized to do that"));
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const formatMentorUpdateStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const blog = await Blog.find({ _id: req.params.id, status: "waiting" });

  if (blog == null) {
    return next(new Error("No waiting blog found with that id"));
  }

  if (blog.blogCateId !== (req as any).user.majorId) {
    return next(
      new Error("Review mentor must be in the same major with the blog")
    );
  }

  if (req.body.status == "rejected" || req.body.status == "public") {
    req.body = { status: req.body.status };
    next();
  } else {
    next(new Error("Review status is not valid"));
  }
};

export const formatUpdateData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const updateField: any = {};

  if (req.body.status == "public" && (req as any).user.role !== "mentor") {
    return next(
      new AppError(403, "fail", "You are not allowed to do this action")
    );
  }

  // Nếu status là draft thì sẽ không thay đổi status vì bài viết chưa được công khai
  if (updateField.status !== "draft") {
    updateField.status = "private";
  }
  updateField.title = req.body.title;
  updateField.content = req.body.content;
  updateField.description = req.body.description;
  updateField.contentRaw = req.body.contentRaw;
  updateField.blogSeriesId = req.body.blogSeriesId;

  req.body = updateField;
  next();
};

export const checkBlogStatus = (...status: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const blog = await Blog.findById(req.params.id);
    if (!status.includes(blog.status)) {
      return next(
        new AppError(403, "fail", "You are not allowed to do this action")
      );
    }
    next();
  };
};

export const getWaitingBlogs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const blogs = await Blog.find({})
    .populate("userId")
    .where("status")
    .in(["waiting", "rejected"]);
  res.status(200).json({
    status: "success",
    data: {
      blogs,
    },
  });
};
