import { Request, Response, NextFunction } from 'express';
import * as base from './baseController';
import {IBlog} from "../models/blogModel";
const Blog = require('../models/blogModel');

export const createBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {title, content, description, contentRaw, blogSeriesId} = req.body;
        const user = (req as any).user;

        if (!title || !content || !description || !contentRaw) {
            return next(new Error('Please provide all required fields'));
        }

        const blog: IBlog = await Blog.create({
            title,
            content,
            description,
            contentRaw,
            userId: user._id,
            blogSeriesId: blogSeriesId ? blogSeriesId : null
        })

        res.status(200).json({
            status: "success",
            data: {
                blog,
            },
        });
    } catch (error) {
        next(error);
    }
}