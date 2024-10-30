import express from 'express';
import passport from 'passport';
import session from 'express-session';
import { connectDB } from '../utils/db.js';
import { loginRouter } from '../routes/login.js';
import discordStrategy from '../middlewares/discord.js';
import { User } from '../models/user.js';
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { config } from "dotenv";
config();

const app = express();

// Conectar a MongoDB
connectDB();

// Middleware de sesión
app.use(session({
  secret: process.env.SESSION_SECRET || 'tu_secreto_seguro',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// Lista de emails autorizados para Google
const emails = ["acastrosandova3@gmail.com"];

// Configuración de Google (mantenida igual)
passport.use(
  "auth-google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google",
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

// Nueva configuración de Facebook
passport.use(
  "auth-facebook",
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:3000/auth/facebook/callback",
      profileFields: ['id', 'emails', 'name']
    },
    function(accessToken, refreshToken, profile, done) {
      // Aquí puedes personalizar la lógica de verificación similar a Google
      done(null, profile);
    }
  )
);

// Inicializar Discord (mantenido tal cual)
discordStrategy();

// Serialización/Deserialización
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Rutas
app.use('/auth', loginRouter);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('¡Algo salió mal!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});