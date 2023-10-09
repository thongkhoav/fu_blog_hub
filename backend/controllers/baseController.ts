import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";
const Blog = require("../models/blogModel");

const APIFeatures = require("../utils/apiFeatures");

export const deleteOne =
  (Model: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const doc = await Model.findByIdAndDelete(req.params.id);

      if (!doc) {
        return next(
          new AppError(404, "fail", "No document found with that id")
        );
      }

      res.status(204).json({
        status: "success",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  };

export const updateOne =
  (Model: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!doc) {
        return next(
          new AppError(404, "fail", "No document found with that id")
        );
      }

      res.status(200).json({
        status: "success",
        data: doc,
      });
    } catch (error) {
      next(error);
    }
  };

export const createOne =
  (Model: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const doc = await Model.create(req.body);

      res.status(201).json({
        status: "success",
        data: doc,
      });
    } catch (error) {
      next(error);
    }
  };

export const getOne =
  (Model: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const doc = await Model.findById(req.params.id);

      if (!doc) {
        return next(
          new AppError(404, "fail", "No document found with that id")
        );
      }

      res.status(200).json({
        status: "success",
        data: doc,
      });
    } catch (error) {
      next(error);
    }
  };

export const getAll =
  (Model: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const features = new APIFeatures(Model.find(), req.query)
        .sort()
        .paginate();

      const doc = await features.query;

      res.status(200).json({
        status: "success",
        results: doc.length,
        data: doc,
      });
    } catch (error) {
      next(error);
    }
  };
