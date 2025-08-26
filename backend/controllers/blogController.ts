import { Request, Response, NextFunction, raw } from "express";
import * as base from "./baseController";
import { IBlog } from "../models/blogModel";
import AppError from "../utils/appError";
import mongoose from "mongoose";
const Blog = require("../models/blogModel");
const Report = require("../models/reportModel");
const Tag = require("../models/tagModel");
const Notification = require("../models/notificationModel");
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
      hideComment,
    } = req.body;
    const user = (req as any).user;
    let blogSeries = null;

    // Check if title is valid
    if (title.length > 150 || title.length < 3) {
      const error = new AppError(403, "fail", "Title is not valid");
      return next(error);
    }

    // Check if content is valid
    if (contentRaw.length < 10) {
      const error = new AppError(403, "fail", "Content is not valid");
      return next(error);
    }

    // Check if blogSeries exists and if it belongs to the user
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

    // New blog posts can be either draft or waiting
    // At this point, BlogState is undefined
    if (status && status !== BlogState.DRAFT && status !== BlogState.WAITING) {
      const error = new AppError(403, "fail", "Invalid status");
      next(error);
    }

    contentRaw = he.decode(contentRaw);

    const tagIds: Array<String> = [];

    if (!tags) {
      next(new AppError(403, "fail", "Tags are required"));
    }

    for (const tag of tags) {
      // Check if tag is too long
      if (tag.length > 20) {
        const error = new AppError(403, "fail", "Tag is too long");
        return next(error);
      }

      // Check if tag contains special characters
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
      hideComment,
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

export const voteBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { blogId, vote } = req.body;
  const user = (req as any).user;

  if (!blogId || !vote) {
    return next(new AppError(401, "error", "Missing blogId or vote"));
  }

  const blog = await Blog.findById(blogId);
  if (!blog) {
    return next(new Error("No blog found with that id"));
  }
  if (blog.userId.toString() === user._id.toString()) {
    return next(
      new AppError(403, "error", "You cannot vote for your own post")
    );
  }
  if (vote !== "up" && vote !== "down") {
    return next(new Error("Invalid vote"));
  }

  if (
    blog.voteUpUser.includes(user._id) ||
    blog.voteDownUser.includes(user._id)
  ) {
    return next(
      new AppError(403, "error", "You have already voted for this post")
    );
  }

  if (vote === "up") {
    blog.voteUpUser.push(user._id);
    blog.totalPoint += 1;
  }

  if (vote === "down") {
    blog.voteDownUser.push(user._id);
    blog.totalPoint -= 1;
  }

  await blog.save();
  res.status(200).json({
    status: "success",
    data: blog,
  });
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
  // Used when user deletes or admin handles report
  const blog = await Blog.findById(req.params.id);
  blog.status = BlogState.REMOVED;

  const { resolveContent, objectId } = req.body;

  // Find all reports about this blog and resolve them, content is deleted
  const reports = await Report.find({
    objectId: req.params.id,
    resolved: false,
    type: "blog",
    resolveContent: "",
  });

  for (const report of reports) {
    report.resolved = true;
    report.resolveContent = "Post has been deleted";
    report.resolvedAt = new Date();
    report.resolvedBy = (req as any).user._id;

    await report.save();
  }

  // If admin deletes, push notification to user
  if ((req as any).user.role === "admin") {
    await Notification.create({
      userId: blog.userId,
      content: `Post ${blog.title} has been deleted due to violation`,
    });
  }

  await blog.save();
  res.status(200).json({
    status: "success",
    message: "Post has been deleted",
    data: blog,
  });
};

export const getOnePublicBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(404).json({ msg: `No blog with id :${req.params.id}` });

    const blogPopulate = await Blog.findOne({
      _id: req.params.id,
      status: "public",
    })
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
  } catch (error: any) {
    console.log(error);

    if (error.name === "CastError") {
      return next(new AppError(404, "fail", "Blog not found"));
    }
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
      .sort({ updatedAt: "desc" })
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

export const getCustomUserBlogs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user;
  try {
    if (!user.favoriteCates || user.favoriteCates.length === 0) {
      const blogPopulate = await Blog.find({
        status: BlogState.PUBLIC,
      })
        .select("-contentRaw")
        .sort({ createdAt: "desc" })
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
    } else {
      const blogPopulate = await Blog.find({
        status: BlogState.PUBLIC,
        blogCateId: { $in: user.favoriteCates },
      })
        .select("-contentRaw")
        .sort({ createdAt: "desc" })
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
    }
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

export const updateStatusBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!blog) {
      return next(new AppError(404, "fail", "No document found with that id"));
    }

    if (blog.userId.toString() !== (req as any).user._id.toString()) {
      let newNoti: any = {
        userId: blog.userId,
        content:
          blog.status === "public"
            ? `The post ${blog.title} has been approved by the mentor`
            : `The post ${blog.title} has been rejected by the mentor`,
      };
      if (req.body.status === "public") {
        newNoti["url"] = "/blogs/" + blog._id;
      }
      await Notification.create(newNoti);
    }

    res.status(200).json({
      status: "success",
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

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

  if (!(req as any).user.majorId.includes(blog.blogCateId)) {
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

  // If the current status is draft, it can only be changed to waiting or draft
  if (
    currentStatus === BlogState.DRAFT &&
    status !== BlogState.WAITING &&
    status !== BlogState.DRAFT
  ) {
    const error = new AppError(403, "fail", "Invalid status");
    return next(error);
  }

  // If the current status is rejected, it can only be changed to waiting or draft
  if (
    currentStatus === BlogState.REJECTED &&
    status !== BlogState.WAITING &&
    status !== BlogState.DRAFT
  ) {
    const error = new AppError(403, "fail", "Invalid status");
    return next(error);
  }

  // Check if the title is valid
  if (!title || title.length > 150 || title.length < 3) {
    const error = new AppError(403, "fail", "Title is not valid");
    return next(error);
  }

  // Check if the content is valid
  if (!contentRaw || contentRaw.length < 10) {
    const error = new AppError(403, "fail", "Content is not valid");
    return next(error);
  }

  // Check if the blog series exists, and if so, whether it belongs to the user
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

  // The newly created post can be either draft or waiting
  // At this point, BlogState is undefined
  if (status && status !== BlogState.DRAFT && status !== BlogState.WAITING) {
    const error = new AppError(403, "fail", "Invalid status");
    next(error);
  }

  contentRaw = he.decode(contentRaw);

  const tagIds: Array<String> = [];

  for (const tag of tags) {
    // Check if the tag is too long
    if (tag.length > 20) {
      const error = new AppError(403, "fail", "Tag is too long");
      return next(error);
    }

    // Check if the tag contains special characters
    const regex = /^[a-zA-Z0-9]+$/;
    if (!regex.test(tag)) {
      const error = new AppError(403, "fail", "Tag is not valid");
      return next(error);
    }

    const lowercasedTag = tag.toLowerCase();
    try {
      // Check if the tag exists in the database
      let tagExist = await Tag.findOne({ name: lowercasedTag });

      if (tagExist) {
        tagExist.numBlog += 1;
        await tagExist.save();
        tagIds.push(tagExist._id);
      } else {
        // If the tag does not exist, create a new one
        const newTag = await Tag.create({ name: lowercasedTag });
        newTag.numBlog = 1;
        await newTag.save();
        tagIds.push(newTag._id);
      }
    } catch (error) {
      // Handle any errors
      return next(error);
    }
  }

  // Assign the fields to be updated
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
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res
        .status(404)
        .json({ message: `No blog with id ${req.params.id}` });

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
    .where({ blogCateId: { $in: majorId } })
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
        msg: `No blog found with that filter`,
      });
};

export const getLastesBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const blogs = await Blog.find({ status: "public" })
    .sort({ createdAt: "desc" })
    .limit(9)
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

export const getHighlightBlogs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const blogs = await Blog.find({ status: "public" })
    .sort({ createdAt: "desc", totalPoint: "desc", numView: "desc" })
    .limit(4)
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
    data: blogs,
  });
};
