const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require('../models/User')

app.get("/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"],
}));
app.get("/auth/google/callback", passport.authenticate("google", {
    failureRedirect: "/login",
    successFlash: "Successfully logged in!",
}, (req, res) => {
    if (req.user) {
        // const mySecretMessage = "This is secret message";
        // const sessionKey = md5(
        //     mySecretMessage + new Date().getTime() + req.user.username
        // );
        // sessionUser[sessionKey] = req.user;

        // res.cookie(cookieKey, sessionKey, {
        //     maxAge: 3600 * 1000,
        //     httpOnly: true,
        //     sameSite: "None",
        //     secure: true,
        // });

        res.redirect("https://localhost:3001/home");
    } else {
        res.redirect("https://localhost:3001/login");
    }

}));

module.exports = router;