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
exports.getNewAccessToken = exports.deleteUser = exports.updateUser = exports.getUser = exports.getAllUsers = exports.deleteMe = void 0;
const base = __importStar(require("./baseController"));
const appError_1 = __importDefault(require("../utils/appError"));
const util_1 = require("util");
const User = require('../models/userModel');
const { createNewAccessToken } = require('../services/createNewAccessToken');
const jwt = require('jsonwebtoken');
const deleteMe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield User.findByIdAndUpdate(req.user.id, {
            active: false,
        });
        res.status(204).json({
            status: 'success',
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteMe = deleteMe;
exports.getAllUsers = base.getAll(User);
exports.getUser = base.getOne(User);
// Don't update password on this
exports.updateUser = base.updateOne(User);
exports.deleteUser = base.deleteOne(User);
// Get new access token
const getNewAccessToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1) check if the token is there
        let refeshToken;
        if (req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")) {
            refeshToken = req.headers.authorization.split(" ")[1];
        }
        if (!refeshToken) {
            return next(new appError_1.default(401, "fail", "You are not logged in! Please login in to continue"));
        }
        // 2) Verify token
        const decode = yield (0, util_1.promisify)(jwt.verify)(refeshToken, process.env.REFRESH_TOKEN_SIGN_SECRET);
        const user = yield User.findById(decode.id);
        if (!user) {
            return next(new appError_1.default(404, 'fail', 'No user found with that id'));
        }
        const newAccessToken = createNewAccessToken(user);
        res.status(200).json({
            status: 'success',
            token: newAccessToken,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getNewAccessToken = getNewAccessToken;
