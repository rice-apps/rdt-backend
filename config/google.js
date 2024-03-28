const passport = require("passport");
const User = require("../models/User");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, cb) => {

            let user = await User.findOne({
                thirdPartyId: profile.id,
            });
            if (!user) {
                console.log("New User!")
                console.log(profile)
                user = new User({
                    fullName: profile.displayName,
                    email: profile.emails[0].value,
                    thirdPartyId: profile.id,
                });
                await user.save();
            }

            return cb(null, user);
        }
    )
);