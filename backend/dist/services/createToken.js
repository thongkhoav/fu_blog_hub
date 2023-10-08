"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRefreshToken = exports.createNewAccessToken = void 0;
const jwt = require("jsonwebtoken");
const createNewAccessToken = (user) => {
    const { id, email } = user;
    return jwt.sign({
        id,
        email,
    }, process.env.ACCESS_TOKEN_SIGN_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};
exports.createNewAccessToken = createNewAccessToken;
const createRefreshToken = (user) => {
    const { id, email } = user;
    return jwt.sign({
        id,
        email,
    }, process.env.REFRESH_TOKEN_SIGN_SECRET, {
        expiresIn: "7d",
    });
};
exports.createRefreshToken = createRefreshToken;
