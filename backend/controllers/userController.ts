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
export const getAllUsers = base.getAll(User);
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
    let refeshToken;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      refeshToken = req.headers.authorization.split(" ")[1];
    }
    if (!refeshToken) {
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
      refeshToken,
      process.env.REFRESH_TOKEN_SIGN_SECRET
    );

    const user = await User.findById(decode.id);

    if (!user) {
      return next(new AppError(404, "fail", "No user found with that id"));
    }

    const newAccessToken = createNewAccessToken(user);

    res.status(200).json({
      status: "success",
      token: newAccessToken,
    });
  } catch (error) {
    next(error);
  }
};
