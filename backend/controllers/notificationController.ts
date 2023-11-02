import { Request, Response, NextFunction } from "express";
import * as base from "./baseController";
const Notification = require("../models/notificationModel");

class notificationController {
    async getAllNotification(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user._id;
            const notifications = await Notification.find({ userId: userId }).sort({ createdAt: -1 }).limit(10);
            await Notification.updateMany({ userId: userId }, { readed: true });

            res.status(200).json({
                status: "success",
                data: notifications,
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async getCountNotification(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user._id;
            const count = await Notification.countDocuments({ userId: userId, readed: false });
            res.status(200).json({
                status: "success",
                data: count,
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}

module.exports = new notificationController();
