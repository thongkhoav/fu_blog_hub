import { NextFunction, Request, Response } from "express";

const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Category = require("../models/categoryModel");
import AppError from "../utils/appError";
const {
  createNewAccessToken,
  createRefreshToken,
} = require("../services/createToken");

exports.login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // 1) check if email and password exist
    if (!email || !password) {
      return next(
        new AppError(404, "fail", "Please provide email or password")
      );
    }

    // 2) check if user exist and password is correct
    const user = await User.findOne({
      email,
    }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError(401, "fail", "Email or Password is wrong"));
    }

    // 3) All correct, send jwt to client
    const token = createNewAccessToken(user);
    const refreshToken = createRefreshToken(user);

    // Remove the password from the output
    delete user.password;
    user.accessToken = token;
    user.refreshToken = refreshToken;

    res.status(200).json({ ...user._doc, accessToken: token, refreshToken });
  } catch (err) {
    next(err);
  }
};

exports.signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.create({
      email: req.body.email,
      fullName: req.body.fullName,
      password: req.body.password,
      role: req.body.role,
    });

    const token = createNewAccessToken(user);
    const refreshToken = createRefreshToken(user);

    user.password = undefined;

    res.status(201).json({
      status: "success",
      token,
      refreshToken,
      user,
    });
  } catch (err) {
    next(err);
  }
};

exports.addMentorAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const marjor = await Category.findById(req.body.majorId);
    if (!marjor) {
      return next(new AppError(404, "fail", "No major found with that id"));
    }

    const user = await User.create({
      email: req.body.email,
      fullName: req.body.fullName,
      password: req.body.password,
      phone: req.body.phone,
      role: "mentor",
      majorId: req.body.majorId, // major is category
    });

    user.password = undefined;

    res.status(201).json({
      status: "success",
      message: "Mentor account has been created",
      user,
    });
  } catch (err) {
    next(err);
  }
};

exports.protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1) check if the token is there
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
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
      token,
      process.env.ACCESS_TOKEN_SIGN_SECRET
    );

    // 3) check if the user is exist (not deleted)
    const user = await User.findById(decode.id);
    if (!user) {
      return next(new AppError(401, "fail", "This user is no longer exist"));
    }

    (req as any).user = user;
    next();
  } catch (err) {
    next(err);
  }
};

exports.restrictTo = (...roles: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes((req as any).user.role)) {
      return next(
        new AppError(403, "fail", "You are not allowed to do this action")
      );
    }
    next();
  };
};

exports.loginGoogleSuccess = async (req: Request, res: Response, next: NextFunction) => {

}