import { Request, Response, NextFunction } from "express";
import * as base from "./baseController";
import { ICategory } from "../models/categoryModel";
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
export const deleteCategory = base.deleteOne(Category);
export const getAllCategory = base.getAll(Category);
export const updateCategory = base.updateOne(Category);
