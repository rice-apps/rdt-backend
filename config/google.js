const passport = require("passport");
const User = require("../models/User");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const adminEmails = process.env.ADMIN_EMAILS.split(",");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, cb) => {
      let user = await User.findOne({
        thirdPartyId: profile.id,
      });
      const userEmail = profile.emails[0].value;

      if (!user) {
        user = new User({
          fullName: profile.displayName,
          email: userEmail,
          isAdmin: adminEmails.includes(userEmail),
          thirdPartyId: profile.id,
        });
        await user.save();
      } else {
        user.isAdmin = adminEmails.includes(userEmail);
        await user.save();
      }

      return cb(null, user);
    }
  )
);
