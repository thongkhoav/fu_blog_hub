const redis = require('redis');
import { Request, Response } from 'express';
import AppError from '../utils/appError';
import { log } from 'console';
const Blog = require("../models/blogModel");

const client = redis.createClient();

client.on('connect', () => {
    console.log('Redis client connected');
});


class RedisController {
    static increaseViewWithCache = async (req: Request, res: Response, next: any) => {
        const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress; // Lấy địa chỉ IP của người dùng
        const cacheKey = `ip:${clientIP}-blog:${req.params.id}`;

        client.get(cacheKey, async (err: any, data: any) => {
            if (err) return new AppError(500, 'faid', err.message);

            if (data) {
                return next();
            }

            // Nếu địa chỉ IP chưa được cache, tiến hành tăng lượt xem
            // Ví dụ, tăng lượt xem trong model Blog ở đây:
            await Blog.findByIdAndUpdate(req.params.id, { $inc: { numView: 1 } }, { new: true })
            client.set(cacheKey, "1", "EX", 60 * 5); // Cache địa chỉ IP trong 5 phút
            next();
        });
    }
}

module.exports = RedisController;