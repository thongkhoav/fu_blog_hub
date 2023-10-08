"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkBlogStatus = exports.formatUpdateData = exports.checkBlogOwnership = exports.updateBlog = exports.getOneBlog = exports.createBlog = void 0;
const base = __importStar(require("./baseController"));
const appError_1 = __importDefault(require("../utils/appError"));
const Blog = require("../models/blogModel");
const createBlog = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content, description, contentRaw, blogSeriesId } = req.body;
        const user = req.user;
        if (!title || !content || !description || !contentRaw) {
            return next(new Error("Please provide all required fields"));
        }
        const blog = yield Blog.create({
            title,
            content,
            description,
            contentRaw,
            userId: user._id,
            blogSeriesId: blogSeriesId ? blogSeriesId : null,
        });
        res.status(200).json({
            status: "success",
            data: {
                blog,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createBlog = createBlog;
exports.getOneBlog = base.getOne(Blog);
exports.updateBlog = base.updateOne(Blog);
const checkBlogOwnership = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blog = yield Blog.findById(req.params.id);
        if (!blog) {
            return next(new Error("No blog found with that id"));
        }
        if (blog.userId.toString() !== req.user._id.toString()) {
            return next(new Error("You are not authorized to do that"));
        }
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.checkBlogOwnership = checkBlogOwnership;
const formatUpdateData = (req, res, next) => {
    const updateField = {};
    if (req.body.status == "public" && req.user.role !== "mentor") {
        return next(new appError_1.default(403, "fail", "You are not allowed to do this action"));
    }
    // Nếu status là draft thì sẽ không thay đổi status vì bài viết chưa được công khai
    if (updateField.status !== "draft") {
        updateField.status = "private";
    }
    updateField.title = req.body.title;
    updateField.content = req.body.content;
    updateField.description = req.body.description;
    updateField.contentRaw = req.body.contentRaw;
    updateField.blogSeriesId = req.body.blogSeriesId;
    req.body = updateField;
    next();
};
exports.formatUpdateData = formatUpdateData;
const checkBlogStatus = (...status) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const blog = yield Blog.findById(req.params.id);
        if (!status.includes(blog.status)) {
            return next(new appError_1.default(403, "fail", "You are not allowed to do this action"));
        }
        next();
    });
};
exports.checkBlogStatus = checkBlogStatus;
