import { Strategy as GoogleStrategy } from 'passport-google-oauth20'; // Cambia el import

// Configuración de Google
passport.use(
  "auth-google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://passport-7kej9odrp-kevinnneiras-projects.vercel.app/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        console.log('Google profile:', profile); // Para debugging
        if (!profile.emails || !profile.emails[0]) {
          return done(new Error('No email provided'), null);
        }

        const userEmail = profile.emails[0].value;
        if (emails.includes(userEmail)) {
          return done(null, profile);
        } else {
          emails.push(userEmail);
          return done(null, profile);
        }
      } catch (error) {
        console.error('Error en Google Strategy:', error);
        return done(error, null);
      }
    }
  )
);