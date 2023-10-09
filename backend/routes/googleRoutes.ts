import { getNewAccessToken } from "../controllers/userController";
import { checkBlogStatus, getOneBlog } from "../controllers/blogController";
const express = require("express");
const googleRoutes = express.Router();
const passport = require("passport")

googleRoutes.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

googleRoutes.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req: any, res: any) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

googleRoutes.get("/google/success", (req: any, res: any) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Credentials", true);
    res.status(200).json(req.user._doc || req.user);
})



module.exports = googleRoutes;  