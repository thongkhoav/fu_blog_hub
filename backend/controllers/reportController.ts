import { Request, Response, NextFunction } from "express";
import * as base from "./baseController";
import AppError from "../utils/appError";
const Report = require("../models/reportModel");
const Blog = require("../models/blogModel");

export const reportOne = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).user;

    if (!req.body.content || !req.body.objectId) {
      return next(new Error("Please provide all required fields"));
    }
    const report = await Report.create({
      type: "blog",
      content: req.body.content,
      objectId: req.body.objectId,
      reportBy: user._id,
    });

    res.status(200).json({
      status: "success",
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

export const resolveReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).user;
    const { content } = req.body;

    if (!content) {
      return next(new AppError(400, "fail", "nhập nội dung giải quyết"));
    }
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      {
        resolved: true,
        resolveContent: content,
        resolvedAt: Date.now(),
        resolvedBy: user._id,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

export const getReportedBlogs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const resolved = req.params.state === "resolved" ? true : false;
    const reports = await Report.find({ type: "blog", resolved })
      .sort({ createdAt: "desc" })
      .populate("reportBy", "_id fullName email avatar");

    res.status(200).json({
      status: "success",
      data: reports,
    });
  } catch (error) {
    next(error);
  }
};

export const getBlogReportDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const report = await Report.findOne({
      type: "blog",
      _id: req.params.idReport,
    }).populate("reportBy", "_id fullName email avatar");

    const blog = await Blog.findById(report.objectId)
      .select("-contentRaw")
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
      data: {
        report,
        blog,
      },
    });
  } catch (error) {
    next(error);
  }
};
