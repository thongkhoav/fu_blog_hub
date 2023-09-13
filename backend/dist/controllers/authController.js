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
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const { createNewAccessToken, createNewRefreshToken } = require('../services/tokenService');
exports.login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // 1) check if email and password exist
        if (!email || !password) {
            return next(new AppError(404, "fail", "Please provide email or password"));
        }
        // 2) check if user exist and password is correct
        const user = yield User.findOne({
            email,
        }).select("+password");
        if (!user || !(yield user.correctPassword(password, user.password))) {
            return next(new AppError(401, "fail", "Email or Password is wrong"));
        }
        // 3) All correct, send jwt to client
        const token = createNewAccessToken(user);
        const refreshToken = createNewRefreshToken(user);
        // Remove the password from the output
        user.password = undefined;
        res.status(200).json({
            status: "success",
            token,
            refreshToken,
            data: {
                user,
            },
        });
    }
    catch (err) {
        next(err);
    }
});
exports.signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            role: req.body.role,
        });
        const token = createNewAccessToken(user);
        const refreshToken = createNewRefreshToken(user);
        user.password = undefined;
        res.status(201).json({
            status: "success",
            token,
            refreshToken,
            data: {
                user,
            },
        });
    }
    catch (err) {
        next(err);
    }
});
exports.protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1) check if the token is there
        let token;
        if (req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            return next(new AppError(401, "fail", "You are not logged in! Please login in to continue"));
        }
        // 2) Verify token
        const decode = yield promisify(jwt.verify)(token, process.env.ACCESS_TOKEN_SIGN_SECRET);
        // 3) check if the user is exist (not deleted)
        const user = yield User.findById(decode.id);
        if (!user) {
            return next(new AppError(401, "fail", "This user is no longer exist"));
        }
        req.user = user;
        next();
    }
    catch (err) {
        next(err);
    }
});
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError(403, "fail", "You are not allowed to do this action"));
        }
        next();
    };
};
