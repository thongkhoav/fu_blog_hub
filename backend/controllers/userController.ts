import { Request, Response, NextFunction } from "express";
import * as base from "./baseController";
import AppError from "../utils/appError";
import { promisify } from "util";
const User = require("../models/userModel");
const Report = require("../models/reportModel");
const Bookmark = require("../models/bookmarkModel");
const Notification = require("../models/notificationModel");
const FollowModel = require("../models/followUserModel");
const { createNewAccessToken } = require("../services/createToken");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

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

export const getUserBookmark = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // find only user with role is not admin
    const userBookmarks = await Bookmark.find({
      userId: (req as any).user._id,
      removed: false,
    });

    res.status(200).json({
      status: "success",
      results: userBookmarks.length,
      data: userBookmarks,
    });
  } catch (error) {
    next(error);
  }
};

// follow api
export const unFollowUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await FollowModel.deleteOne({
      userId: (req as any).user._id,
      followUserId: req.params.followUserId,
    });
    await User.findByIdAndUpdate(req.params.followUserId, {
      $inc: { numFollower: -1 },
    });

    await User.findByIdAndUpdate((req as any).user._id, {
      $inc: { numFollowing: -1 },
    });

    res.status(200).json({
      status: "success",
      message: "Unfollow user successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const followUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const checkFollow = await FollowModel.findOne({
      userId: (req as any).user._id,
      followUserId: req.params.followUserId,
    });

    if (checkFollow) {
      return next(new AppError(400, "fail", "Bạn đã follow user này rồi"));
    }

    const checkUser = await User.findById(req.params.followUserId);
    if (!checkUser) {
      return next(new AppError(400, "fail", "Không tìm thấy user này"));
    }

    const user = await FollowModel.create({
      userId: (req as any).user._id,
      followUserId: req.params.followUserId,
    });

    await User.findByIdAndUpdate(req.params.followUserId, {
      $inc: { numFollower: +1 },
    });

    await User.findByIdAndUpdate((req as any).user._id, {
      $inc: { numFollowing: +1 },
    });

    res.status(200).json({
      status: "success",
      message: "Follow user successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserFollowings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // find only user with role is not admin
    const userFollowings = await FollowModel.find({
      userId: (req as any).user._id,
    }).populate({
      path: "followUserId",
      select: ["fullName", "avatar", "_id", "email"],
    });

    res.status(200).json({
      status: "success",
      results: userFollowings.length,
      data: userFollowings,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserFollowers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // find only user with role is not admin
    const userFollowings = await FollowModel.find({
      followUserId: (req as any).user._id,
    }).populate({
      path: "userId",
      select: ["fullName", "avatar", "_id", "email"],
    });

    res.status(200).json({
      status: "success",
      results: userFollowings.length,
      data: userFollowings,
    });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password, bannedReason } = req.body;

    if (!password) {
      return next(new AppError(400, "fail", "Vui lòng nhập mật khẩu mới"));
    }
    const hash = await bcrypt.hash(password, 12);

    const user = await User.findOneAndUpdate(
      {
        _id: req.params.id,
        role: "mentor",
      },
      {
        password: hash,
      },
      {
        new: true,
      }
    );

    res.status(201).json({
      status: "success",
      message: "Đổi mật khẩu thành công",
      user,
    });
  } catch (err) {
    next(err);
  }
};

export const getUser = base.getOne(User);

export const getBasicProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // find only user with role is not admin
    const doc = await User.findOne({
      _id: req.params.id,
      role: { $ne: "admin" },
    }).select("-password -__v -isVerifiedEmail");

    res.status(200).json({
      status: "success",
      data: doc,
    });
  } catch (error) {
    next(error);
  }
};

// Don't update password on this
export const updateUser = base.updateOne(User);

// admin delete
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { banUntil, bannedReason } = req.body;

  if (!bannedReason || bannedReason === "") {
    return next(new AppError(400, "fail", "Vui lòng nhập lý do ban"));
  }

  try {
    // find only user with role is not admin
    const user = await User.findOne({
      _id: req.params.id,
      role: { $ne: "admin" },
    });

    user.isBanned = true;
    user.ban = {
      banUntil: new Date(banUntil),
      bannedReason,
    };

    // tìm tất cả các report về blog này và resolve nó, content là deleted
    const reports = await Report.find({
      objectId: req.params.id,
      resolved: false,
      type: "user",
      resolveContent: "",
    });

    for (const report of reports) {
      report.resolved = true;
      report.resolveContent = "Người dùng đã bị ban";
      report.resolvedAt = new Date();
      report.resolvedBy = (req as any).user._id;

      await report.save();
    }

    // nếu admin xoá thì push noti qua user
    if ((req as any).user.role === "admin") {
      await Notification.create({
        userId: user._id,
        content: `Người dùng bị ban do ${bannedReason}`,
      });
    }

    await user.save();

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

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
