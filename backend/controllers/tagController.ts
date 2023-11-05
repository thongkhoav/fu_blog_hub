import { Request, Response, NextFunction, raw } from "express";
import * as base from "./baseController";
import { ITag } from "../models/tagModel";
import AppError from "../utils/appError";
const Tag = require("../models/tagModel");

export const createTag = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).user;

    if (!req.body.name) {
      return next(new Error("Please provide all required fields"));
    }
    const tag: ITag = await Tag.create({
      name: req.body.name,
    });

    res.status(200).json({
      status: "success",
      data: tag,
    });
  } catch (error) {
    next(error);
  }
};

export const getOneTag = base.getOne(Tag);
export const deleteTag = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const doc = await Tag.findByIdAndUpdate(
      req.params.id,
      {
        status: false,
      },
      {
        new: true,
      }
    );

    if (!doc) {
      return next(new AppError(404, "fail", "No tag found with that id"));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const getAllTag = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const doc = await Tag.find().sort({ numBlog: -1 });

    res.status(200).json({
      status: "success",
      results: doc.length,
      data: doc,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTag = base.updateOne(Tag);
