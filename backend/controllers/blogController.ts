import { Request, Response, NextFunction, raw } from "express";
import * as base from "./baseController";
import { IBlog } from "../models/blogModel";
import AppError from "../utils/appError";
import { log } from "console";
const Blog = require("../models/blogModel");
const Tag = require("../models/tagModel");
const BlogSeries = require("../models/blogSeriesModel");
const he = require("he"); // Import thư viện he

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
    let {
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

    // Kiểm tra xem tiêu đề có hợp lệ hay không
    if (title.length > 150 || title.length < 3) {
      const error = new AppError(403, "fail", "Title is not valid");
      return next(error);
    }

    // Kiểm tra content có hợp lệ hay không
    if (contentRaw.length < 10) {
      const error = new AppError(403, "fail", "Content is not valid");
      return next(error);
    }

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

    contentRaw = he.decode(contentRaw);

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
      blogTagIds: tagIds,
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

export const getOneBlog = async (
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

export const softDeleteBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const blog = await Blog.findById(req.params.id);
  blog.status = BlogState.REMOVED;
  await blog.save();
  res.status(200).json({
    status: "success",
    data: blog,
  });
};

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

export const getSameAuthorBlogs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const blogPopulate = await Blog.find({
      status: BlogState.PUBLIC,
      userId: req.params.userId,
      _id: { $ne: req.params.blogId },
    })
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

    res.status(200).json({
      status: "success",
      results: blogPopulate.length,
      data: blogPopulate,
    });
  } catch (error) {
    next(error);
  }
};

export const getSameCateBlogs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const blogPopulate = await Blog.find({
      status: BlogState.PUBLIC,
      blogCateId: req.params.cateId,
      _id: { $ne: req.params.blogId },
    })
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

    res.status(200).json({
      status: "success",
      results: blogPopulate.length,
      data: blogPopulate,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPrivateBlogs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const blogStateArr = Object.values(BlogState);
  const status = req.query.status ?? BlogState.PUBLIC;
  if (!blogStateArr.includes(status.toString())) {
    const error = new AppError(403, "fail", "Invalid status");
    return next(error);
  }

  try {
    const blogPopulate = await Blog.find({
      status,
      userId: (req as any).user._id,
    })
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

    res.status(200).json({
      status: "success",
      results: blogPopulate.length,
      data: blogPopulate,
    });
  } catch (error) {
    next(error);
  }
};

export const getProfilePublicBlogs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const blogPopulate = await Blog.find({
      status: BlogState.PUBLIC,
      userId: req.params.userId,
    })
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

    res.status(200).json({
      status: "success",
      results: blogPopulate.length,
      data: blogPopulate,
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

export const formatUpdateData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let {
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
  const updateField: any = {};

  const blogInfo = await Blog.findById(req.params.id);
  const currentStatus = blogInfo.status;

  // Nếu trạng thái của bài viết là draft thì chỉ được chuyển sang waiting chờ duyệt
  if (
    currentStatus === BlogState.DRAFT &&
    status !== BlogState.WAITING &&
    status !== BlogState.DRAFT
  ) {
    const error = new AppError(403, "fail", "Invalid status");
    return next(error);
  }

  // Nếu trạng thái đang là reject thì chỉ được chuyển sang waiting chờ duyệt hoặc draft
  if (
    currentStatus === BlogState.REJECTED &&
    status !== BlogState.WAITING &&
    status !== BlogState.DRAFT
  ) {
    const error = new AppError(403, "fail", "Invalid status");
    return next(error);
  }

  // Kiểm tra xem tiêu đề có hợp lệ hay không
  if (!title || title.length > 150 || title.length < 3) {
    const error = new AppError(403, "fail", "Title is not valid");
    return next(error);
  }

  // Kiểm tra content có hợp lệ hay không
  if (!contentRaw || contentRaw.length < 10) {
    const error = new AppError(403, "fail", "Content is not valid");
    return next(error);
  }

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

  contentRaw = he.decode(contentRaw);

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

  // Gán lại các trường cần update
  updateField.title = title;
  updateField.description = description;
  updateField.contentRaw = contentRaw;
  updateField.blogSeriesId = blogSeriesId;
  updateField.status = status;
  updateField.blogCateId = blogCateId;
  updateField.blogTagIds = tagIds;
  updateField.thumbnail = thumbnail;

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

export const getApproveBlogs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const majorId = (req as any).user.majorId;
  const statusBlogs =
    req.query.status === "all" ? ["waiting", "rejected"] : [req.query.status];
  const blogs = await Blog.find()
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
    })
    .where({ blogCateId: majorId })
    .where("status")
    .in(statusBlogs);
  res.status(200).json({
    status: "success",
    data: blogs,
  });
};

export const filterBloglist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { category, tag } = req.body;
  console.log("tag", tag);
  var whereObj: any = {
    status: "public",
  };
  category.length ? (whereObj["blogCateId"] = category) : "";
  tag.length ? (whereObj["blogTagIds"] = { $in: tag }) : "";

  const blogs = await Blog.find(whereObj);

  blogs.length
    ? res.status(200).json({
        status: "success",
        data: blogs,
      })
    : res.status(200).json({
        status: "fail",
        data: [],
        msg: `Không có blogs phù hợp! Vui lòng chọn lại!`,
      });
};

export const getLastesBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const blogs = await Blog.find({ status: "public" })
    .sort({ createdAt: "desc" })
    .limit(12)
    .populate({
      path: "userId",
      select: ["fullName", "avatar", "_id"],
    })
    .populate({
      path: "blogCateId",
      select: "name",
    });
  res.status(200).json({
    status: "success",
    data: blogs,
  });
};
