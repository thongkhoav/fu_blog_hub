import { Request, Response, NextFunction, raw } from "express";
import * as base from "./baseController";
import { IBlogSeries } from "../models/blogSeriesModel";
const BlogSeries = require("../models/blogSeriesModel");

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
    });

    res.status(200).json({
      status: "success",
      message: "Thêm series thành công",
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

export const updateSeries = base.updateOne(BlogSeries);
