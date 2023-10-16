import { Request, Response, NextFunction, raw } from "express";
import AppError from "../utils/appError";
const Bookmark = require("../models/bookmarkModel");
const Blog = require("../models/blogModel");

export const addBookmark = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).user;

    let bookmark = await Bookmark.findOne({
      userId: user._id,
      blogId: req.params.blogId,
    });

    if (bookmark && bookmark.removed) {
      bookmark.removed = !bookmark.removed;
      bookmark = await bookmark.save();
      return res.status(200).json({
        status: "success",
        data: bookmark,
      });
    } else if (!bookmark) {
      bookmark = await Bookmark.create({
        userId: user._id,
        blogId: req.params.blogId,
      });

      res.status(200).json({
        status: "success",
        data: bookmark,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const removeBookmark = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).user;

    let bookmark = await Bookmark.findOne({
      userId: user._id,
      blogId: req.params.blogId,
    });

    if (bookmark && !bookmark.removed) {
      bookmark.removed = true;
      bookmark = await bookmark.save();
      return res.status(200).json({
        status: "success",
        data: bookmark,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getBookmarkedBlogs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookmarkedBlogs = await Bookmark.find({
      userId: (req as any).user._id,
      removed: false,
    }).populate({
      path: "blogId",
      select: [
        "_id",
        "title",
        "thumbnail",
        "description",
        "createdAt",
        "updatedAt",
        "slug",
        "totalPoint",
        "numView",
      ],
      populate: [
        {
          path: "userId",
          select: ["fullName", "avatar", "_id"],
        },
        {
          path: "blogCateId",
          select: "name",
        },
      ],
    });
    res.status(200).json({
      status: "success",
      results: bookmarkedBlogs.length,
      data: bookmarkedBlogs,
    });
  } catch (error) {
    next(error);
  }
};
