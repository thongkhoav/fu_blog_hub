import { getNewAccessToken } from "../controllers/userController";
import { checkBlogStatus, getOneBlog } from "../controllers/blogController";
const express = require("express");
const googleRoutes = express.Router();
const passport = require("passport");
const {
  createNewAccessToken,
  createRefreshToken,
} = require("../services/createToken");

googleRoutes.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

googleRoutes.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: process.env.FRONTEND_URL || "http://localhost:3005/login",
    failureMessage: true,
    successRedirect: process.env.FRONTEND_URL || "http://localhost:3005",
  })
);

googleRoutes.get("/google/success", (req: any, res: any) => {
  let user = req.user;
  if (user) {
    res.header(
      "Access-Control-Allow-Origin",
      process.env.FRONTEND_URL || "http://localhost:3005"
    );
    res.header("Access-Control-Allow-Credentials", true);
    user.id = user._id;
    const accessToken = createNewAccessToken(user);
    const refreshToken = createRefreshToken(user);
    user = { ...user, accessToken, refreshToken };
    res.status(200).json(user);
  } else {
    res.status(404).json({});
  }
});

module.exports = googleRoutes;
