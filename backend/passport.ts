import { NextFunction, Request, Response } from "express";

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require("passport");
const User = require("./models/userModel");

passport.use(new GoogleStrategy({
    clientID: "692996051289-3vrdknpneeukpb9tbvls25746hb1s45o.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: 'http://localhost:4000/api/auth/google/callback',
    passReqToCallback: true
},
    function (request: Request, accessToken: String, refreshToken: String, profile: any, done: any) {
        console.log(profile);
        return done(null, profile);
    }
));

passport.serializeUser((user: any, done: any) => {
    done(null, user);
});

passport.deserializeUser((user: any, done: any) => {
    done(null, user);
});
