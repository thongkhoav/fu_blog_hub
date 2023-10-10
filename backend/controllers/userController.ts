import { Request, Response, NextFunction } from "express";
import * as base from "./baseController";
import AppError from "../utils/appError";
import { promisify } from "util";
const User = require("../models/userModel");
const { createNewAccessToken } = require("../services/createToken");
const jwt = require("jsonwebtoken");

export const deleteMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await User.findByIdAndUpdate((req as any).user.id, {
      active: false,
    });

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // find only user with role is not admin
    const doc = await User.find({
      role: { $ne: "admin" },
    });

    res.status(200).json({
      status: "success",
      results: doc.length,
      data: doc,
    });
  } catch (error) {
    next(error);
  }
};
export const getUser = base.getOne(User);

// Don't update password on this
export const updateUser = base.updateOne(User);
export const deleteUser = base.deleteOne(User);

// Get new access token
export const getNewAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1) check if the token is there
    let refreshToken = req.body.refreshToken;
    if (!refreshToken) {
      return next(
        new AppError(
          401,
          "fail",
          "You are not logged in! Please login in to continue"
        )
      );
    }

    // 2) Verify token
    const decode = await promisify(jwt.verify)(
      refreshToken,
      process.env.REFRESH_TOKEN_SIGN_SECRET
    );
    console.log(decode);

    const user = await User.findById(decode.id);

    if (!user) {
      console.log("No user found with that id");

      return next(new AppError(404, "fail", "No user found with that id"));
    }

    const newAccessToken = createNewAccessToken({
      id: user.id,
      email: user.email,
    });

    res.status(200).json({
      status: "success",
      token: newAccessToken,
    });
  } catch (error) {
    next(error);
  }
};
