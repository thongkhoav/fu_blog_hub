import { Request, Response, NextFunction } from "express";
import * as base from "./baseController";
import AppError from "../utils/appError";
const Report = require("../models/reportModel");
const Blog = require("../models/blogModel");

export const reportBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const user = (req as any).user;

    if (!req.body.content || !req.body.objectId || !req.body.reportBy) {
      return next(new Error("Please provide all required fields"));
    }
    const report = await Report.create({
      type: "blog",
      content: req.body.content,
      objectId: req.body.objectId,
      reportBy: req.body.reportBy,
    });

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
    // const user = (req as any).user;

    if (!req.body.content || !req.body.objectId || !req.body.reportBy) {
      return next(new Error("Please provide all required fields"));
    }
    const report = await Blog.aggregate([
      {
        $match: {
          _id: {
            $in: await Report.find({ type: "blog", resolved: false }).distinct(
              "objectId"
            ),
          },
        },
      },
      {
        $lookup: {
          from: "reports",
          localField: "_id",
          foreignField: "objectId",
          as: "reports",
        },
      },
      {
        $addFields: {
          numberOfReports: { $size: "$reports" },
        },
      },
      {
        $match: {
          "reports.resolved": false,
        },
      },
    ]);
    // const report = await Blog.find(

    res.status(200).json({
      status: "success",
      data: report,
    });
  } catch (error) {
    next(error);
  }
};
