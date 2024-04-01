const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
var appType = "";
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
  res.redirect("http://localhost:3000/home");
});

router.get(
  "/auth/google",
  (req, res, next) => {
    req.session.appType = req.query.app;
    appType = req.query.app;
    next();
  },
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
      if (appType === "ticketing") {
        return res.redirect("http://localhost:3000/");
      }
      if (appType === "admin" && req.user.isAdmin) {
        return res.redirect("http://localhost:3000/");
      } else {
        console.log("Not authorized to view this page!");
        return res.redirect("http://localhost:3000/login");
      }
    } else {
      res.redirect("http://localhost:3000/login");
    }
  }
);

module.exports = router;
