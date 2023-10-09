const jwt = require("jsonwebtoken");

interface User {
  id: string;
  // username: string;
  email: string;
  // Thêm các trường khác của đối tượng user tại đây
}

const createNewAccessToken = ({ id, email }: User): User => {
  return jwt.sign(
    {
      id,
      email,
    },
    process.env.ACCESS_TOKEN_SIGN_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

const createRefreshToken = (user: User): User => {
  const { id, email } = user;
  return jwt.sign(
    {
      id,

      email,
    },
    process.env.REFRESH_TOKEN_SIGN_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

export { createNewAccessToken, createRefreshToken };
