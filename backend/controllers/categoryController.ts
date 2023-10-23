import { Request, Response, NextFunction } from "express";
import * as base from "./baseController";
import { ICategory } from "../models/categoryModel";
import AppError from "../utils/appError";
const Category = require("../models/categoryModel");

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body.name) {
      return next(new Error("Please provide all required fields"));
    }
    const cate: ICategory = await Category.create({
      name: req.body.name,
    });

    res.status(200).json({
      status: "success",
      data: cate,
    });
  } catch (error) {
    console.log(error);

    next(error);
  }
};

export const getOneCategory = base.getOne(Category);
export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const doc = await Category.findByIdAndUpdate(
      req.params.id,
      {
        status: false,
      },
      {
        new: true,
      }
    );

    if (!doc) {
      return next(new AppError(404, "fail", "No category found with that id"));
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
export const getAllCategory = base.getAll(Category);
export const updateCategory = base.updateOne(Category);
