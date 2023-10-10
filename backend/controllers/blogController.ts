import { Request, Response, NextFunction, raw } from "express";
import * as base from "./baseController";
import { IBlog } from "../models/blogModel";
import AppError from "../utils/appError";
const Blog = require("../models/blogModel");

export const createBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, thumbnail, description, contentRaw, blogSeriesId } = req.body;
    const user = (req as any).user;

    const blog: IBlog = await Blog.create({
      title,
      description,
      contentRaw,
      thumbnail,
      userId: user._id,
      blogSeriesId: blogSeriesId ? blogSeriesId : null,
    });

    res.status(200).json({
      status: "success",
      data: {
        blog,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getOneBlog = base.getOne(Blog);

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
