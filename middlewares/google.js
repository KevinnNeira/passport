import passport from "passport";
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";
import { config } from "dotenv";

config();

const emails = ["acastrosandova3@gmail.com"];

passport.use(
  "auth-google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      const response = emails.includes(profile.emails[0].value);
      if (response) {
        done(null, profile);
      } else {
        emails.push(profile.emails[0].value);
        done(null, profile);
      }
    }
  )
);

// Serialización específica para Google
passport.serializeUser((user, done) => {
  if (user.provider === 'google') {
    done(null, user);
  } else {
    done(null, user.id); // Para Discord mantiene el comportamiento original
  }
});

passport.deserializeUser((user, done) => {
  if (user.provider === 'google') {
    done(null, user);
  } else {
    // Comportamiento original para Discord
    User.findById(user.id)
      .then(user => done(null, user))
      .catch(err => done(err, null));
  }
});