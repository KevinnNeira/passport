import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { config } from "dotenv";
import { saveUserData } from './auth.js';

config();

const facebookStrategy = () => {
  passport.use(
    "auth-facebook",
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "http://localhost:3000/auth/facebook/callback",
        profileFields: ['id', 'emails', 'name', 'displayName']
      },
      async function(accessToken, refreshToken, profile, done) {
        try {
          const user = await saveUserData(profile, 'facebook');
          done(null, user);
        } catch (error) {
          console.error('Error en autenticación de Facebook:', error);
          done(error, null);
        }
      }
    )
  );
};

export default facebookStrategy;