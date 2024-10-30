import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { config } from "dotenv";
config();

const emails = ["acastrosandova3@gmail.com"];

passport.use(
  "auth-facebook",
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "https://passport-7kej9odrp-kevinnneiras-projects.vercel.app/auth/facebook/callback",
      profileFields: ['id', 'emails', 'name'] // Solicitamos campos especÃficos
    },
    function(accessToken, refreshToken, profile, done) {
      const response = emails.includes(profile.emails?.[0]?.value);
      if (response) {
        done(null, profile);
      } else {
        emails.push(profile.emails?.[0]?.value);
        done(null, profile);
      }
    }
  )
);