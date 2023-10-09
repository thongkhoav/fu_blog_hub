import { Request, Response, NextFunction, raw } from "express";
import * as base from "./baseController";
import { ITag } from "../models/tagModel";
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
export const deleteTag = base.deleteOne(Tag);
export const getAllTag = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const doc = await Tag.find();

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
