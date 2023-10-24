import { Request, Response, NextFunction } from "express";
import * as base from "./baseController";
import { IComment } from "../models/commentModel";
const Comment = require("../models/commentModel");


export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const com: IComment = await Comment.create({
      userId: req.body.userId,
      children: req.body.children,
      blogId: req.body.blogId,
      content: req.body.content,
      status: true,
    })
    
    const comment: IComment = await Comment.findOne({_id: com._id}).populate("userId", "_id fullName avatar")

    console.log(comment)

    res.status(200).json({
      status: "success",
      data: comment,
    });
  } catch (error) {
    console.log(error);

    next(error);
  }
};
export const getAllComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let blogIdProp = req.params.blogId;
    const com: IComment = await Comment.find({ blogId: blogIdProp, isParent: true})
      .populate("userId", "_id fullName avatar")
      .populate({
        path: "children",
        select: "userId content createdAt status",
        populate: {
          path: "userId",
          select: "_id avatar fullName",
        },
      })
      ;

    res.status(200).json({
      status: "success",
      data: com,
    });
  } catch (error) {
    console.log(error);

    next(error);
  }
};
export const getOneComment = base.getOne(Comment);
export const deleteComment =  async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let commentId = req.params.commentId;
    const com = await Comment.findByIdAndUpdate(commentId, { status: false }, { new: true });
    console.log(com + "backend")
    res.status(200).json({
      status: "success",
      data: com,
    });
  } catch (error) {
    console.log(error);

    next(error);
  }
};
export const updateComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const commentId = req.params.commentId;
    const { content, userId, blogId } = req.body;

    // Find the parent comment
    const parentComment = await Comment.findById(commentId);
    console.log(parentComment)
    if (!parentComment) {
      return res.status(404).json({ message: 'Parent comment not found' });
    }

    // Create a new child comment
    const childComment = new Comment({
      userId: userId, // Set user ID as appropriate
      blogId: parentComment.blogId,
      content: content,
      isParent: false, 
    });

    await childComment.save();
    console.log(childComment)

    // Add the child comment to the parent's children array
    parentComment.children.push(childComment._id);
    
    await parentComment.save();

    const updateData: IComment = await Comment.findOne({_id: commentId})
      .populate("userId", "_id fullName avatar")
      .populate({
        path: "children",
        select: "userId content createdAt",
        populate: {
          path: "userId",
          select: "_id avatar fullName"
        }       
      })

    res.status(200).json({
      status: 'success',
      data: updateData,
    });

  } 
  catch (error) {
    console.log(error);
    
    next(error);
  }
};

export const editComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const commentId = req.params.commentId;
    const { contentProps, userId } = req.body;

    // Find the parent comment
    const commentUpdate = await Comment.findByIdAndUpdate(commentId, userId,{ content: contentProps });

    if (!commentUpdate) {
      return res.status(404).json({ message: 'comment not found' });
    }
    
    res.status(200).json({
      status: 'success',
      data: commentUpdate,
    });

  } 
  catch (error) {
    console.log(error);
    
    next(error);
  }
};


export const checkUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const commentId = req.params.commentId;
    const {userId } = req.body;

    // Find the parent comment
    const comment = await Comment.findOne({ _id: commentId, userId: userId });


    if (!comment) {
      return res.status(200).json({ message: 'permission restrict'});
    }
    
    res.status(200).json({
      status: 'success',
      data: true,
    });

  } 
  catch (error) {
    console.log(error);
    
    next(error);
  }
};
