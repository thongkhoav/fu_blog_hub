import { NextFunction, Request, Response } from "express";

const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const User = require("./models/userModel");

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "692996051289-3vrdknpneeukpb9tbvls25746hb1s45o.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "/api/auth/google/callback",
      passReqToCallback: true,
    },
    async function (
      request: Request,
      accessToken: String,
      refreshToken: String,
      profile: any,
      done: any
    ) {
      try {
        // Có tài khoản đăng nhập
        let user = await User.findOne({
          email: profile._json.email,
          password: { $exists: true },
        });

        if (user?.isBanned && new Date(user.ban.banUntil) > new Date()) {
          return done(null, false, {
            message: "Tài khoản của bạn đã bị khóa vì" + user.ban.bannedReason,
          });
        }

        user.isBanned = false;
        user.ban.banUntil = null;
        user.ban.bannedReason = "";
        await user.save();

        if (!user) {
          const { name, email, picture } = profile._json;
          const newUser = new User({
            email: email,
            avatar: picture,
            fullName: name,
            password: "123456",
            role: "student",
            active: true,
            isVerifiedEmail: true,
          });
          const savedUser = await newUser.save();
          return done(null, { ...savedUser._doc });
        }
        return done(null, { ...user._doc });
      } catch (err) {
        console.log(err);
        return done(err);
      }
    }
  )
);

passport.serializeUser((user: any, done: any) => {
  done(null, user);
});

passport.deserializeUser((user: any, done: any) => {
  done(null, user);
});
