const jwt = require("jsonwebtoken");

interface User {
    id: string;
    username: string;
    email: string;
    // Thêm các trường khác của đối tượng user tại đây
}

exports.createNewAccessToken = (user:User) : User => {
    const { id, username, email } = user;
    return jwt.sign(
        {
            id,
            username,
            email,
        },
        process.env.ACCESS_TOKEN_SIGN_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN,
        },
    );
}

exports.createRefreshToken = (user:User) => {
    const { id, username, email } = user;
    return jwt.sign(
        {
            id,
            username,
            email,
        },
        process.env.REFRESH_TOKEN_SIGN_SECRET,
        {
            expiresIn: '7d'
        },
    );
}
