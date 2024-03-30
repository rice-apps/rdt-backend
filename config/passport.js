const passport = require("passport");
const User = require("../models/User");

passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
    const currentUser = await User.findOne({
        thirdPartyId: id
    });
    done(null, currentUser);
});