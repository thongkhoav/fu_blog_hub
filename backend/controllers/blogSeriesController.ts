import { Request, Response, NextFunction, raw } from "express";
import * as base from "./baseController";
import { IBlogSeries } from "../models/blogSeriesModel";
import AppError from "../utils/appError";
const BlogSeries = require("../models/blogSeriesModel");
const Blog = require("../models/blogModel");

export const checkSeriesOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const series = await BlogSeries.findById(req.params.id);

    if (!series) {
      return next(new Error("No series found with that id"));
    }

    if (series.userId.toString() !== (req as any).user._id.toString()) {
      return next(new Error("You are not authorized to do that"));
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const createSeries = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).user;

    if (!req.body.title || !req.body.description) {
      return next(new Error("Please provide all required fields"));
    }
    const blogSeries: IBlogSeries = await BlogSeries.create({
      title: req.body.title,
      description: req.body.description,
      userId: user._id,
      numBlog: req.body.blogIds.length,
    });

    const update = await Blog.updateMany(
      { _id: { $in: req.body.blogIds } },
      { $set: { blogSeriesId: blogSeries._id } }
    );

    res.status(200).json({
      status: "success",
      message: "Thêm series thành công",
      blogSeries,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSeries = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).user;

    if (!req.body.title || !req.body.description) {
      return next(
        new AppError(400, "fail", "Please provide all required fields")
      );
    }
    const blogSeries: IBlogSeries = await BlogSeries.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        numBlog: req.body.blogIds.length,
      },
      { new: true }
    );

    // remove blogSeriesId of all blogs in this series
    // update blogSeriesId for new chosen blogs in this series
    // vì có thể 1 blog remove ra khỏi series, 1 blog khác lại add vào series
    await Blog.updateMany(
      { blogSeriesId: req.params.id },
      { $set: { blogSeriesId: "" } }
    );

    const update = await Blog.updateMany(
      { _id: { $in: req.body.blogIds } },
      { $set: { blogSeriesId: req.params.id } }
    );

    res.status(200).json({
      status: "success",
      message: "Cập nhật series thành công",
      blogSeries,
    });
  } catch (error) {
    next(error);
  }
};

export const getOneSeries = base.getOne(BlogSeries);
export const deleteSeries = base.deleteOne(BlogSeries);
export const getAllSeries = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const doc = await BlogSeries.find();

    res.status(200).json({
      status: "success",
      results: doc.length,
      data: doc,
    });
  } catch (error) {
    next(error);
  }
};

// get all blogs of a series
export const getBlogsOfSeries = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await Blog.find({ blogSeriesId: req.params.id })
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
      results: data.length,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getProfileSeries = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const doc = await BlogSeries.find({ userId: req.params.id });

    res.status(200).json({
      status: "success",
      results: doc.length,
      data: doc,
    });
  } catch (error) {
    next(error);
  }
};
