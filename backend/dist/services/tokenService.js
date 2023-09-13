"use strict";
const jwt = require("jsonwebtoken");
exports.createNewAccessToken = (user) => {
    const { id, username, email } = user;
    return jwt.sign({
        id,
        username,
        email,
    }, process.env.ACCESS_TOKEN_SIGN_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};
exports.createRefreshToken = (user) => {
    const { id, username, email } = user;
    return jwt.sign({
        id,
        username,
        email,
    }, process.env.REFRESH_TOKEN_SIGN_SECRET, {
        expiresIn: '7d'
    });
};
