import passport from "passport";
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";
import { config } from "dotenv";
import { saveUserData } from './auth.js';

config();

const googleStrategy = () => {
  passport.use(
    "auth-google",
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback",
      },
      async function(accessToken, refreshToken, profile, done) {
        try {
          const user = await saveUserData(profile, 'google');
          done(null, user);
        } catch (error) {
          console.error('Error en autenticación de Google:', error);
          done(error, null);
        }
      }
    )
  );
};

export default googleStrategy;