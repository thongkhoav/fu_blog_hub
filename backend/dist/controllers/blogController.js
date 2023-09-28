"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBlog = void 0;
const Blog = require('../models/blogModel');
const createBlog = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content, description, contentRaw } = req.body;
    // const user = (req as any).user;
    // console.log(user)
    try {
        const blog = yield Blog.create({
            title,
            content,
            description,
            contentRaw,
        });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
    res.send(content);
});
exports.createBlog = createBlog;
