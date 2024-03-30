const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");

router.get("/login/success", (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      message: "user has successfully authenticated",
      user: req.user,
      // cookies: req.cookies
    });
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "user failed to authenticate.",
  });
});

router.post("/logout", (req, res) => {
  req.logOut();
  res.redirect("/login");
  console.log(`-------> User Logged out`);
});

router.get("/home", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send("You must be logged in to view this page");
  }
  // res.send("Welcome to your dashboard, " + req.user.email);
  res.redirect("https://localhost:3000/home");
});

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    // successRedirect: '/home',
    failureRedirect: "/login",
    successFlash: "Successfully logged in!",
  }),
  (req, res) => {
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

      res.redirect("https://localhost:3000/home");
    } else {
      res.redirect("https://localhost:3000/login");
    }
  }
);

module.exports = router;
