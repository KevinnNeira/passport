import express from 'express';
import passport from 'passport';
import session from 'express-session';
import { connectDB } from '../utils/db.js';
import { loginRouter } from '../routes/login.js';
import discordStrategy from '../middlewares/discord.js';
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { config } from "dotenv";
config();

const app = express();

// Conectar a MongoDB
connectDB();

// Middleware para archivos estáticos
app.use(express.static('public'));

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

// Agrega una ruta para la página principal
app.get('/', (req, res) => {
  // Redirige a index.html
  res.sendFile('index.html', { root: 'public' });
});

// (El resto de tu código permanece igual)

// Configuración de Google (mantenida igual)
passport.use(
  "auth-google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://passport-hazel.vercel.app/auth/google/callback",
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

app.get('/hola', (req, res) => {
  res.send('Hola Mundo');
});

// Nueva configuración de Facebook
passport.use(
  "auth-facebook",
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "https://passport-hazel.vercel.app/auth/facebook/callback",
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
  if (user.provider === 'google') {
    done(null, { id: user.id, provider: 'google' });
  } else if (user.provider === 'facebook') {
    done(null, { id: user.id, provider: 'facebook' });
  } else {
    // Para Discord
    done(null, { id: user.id, provider: 'discord' });
  }
});

passport.deserializeUser(async (data, done) => {
  try {
    if (data.provider === 'google' || data.provider === 'facebook') {
      return done(null, data);
    }
    // Para Discord
    const user = await User.findById(data.id);
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

// En index.js
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
  });
});

// Ruta de debug
app.get('/auth/debug', (req, res) => {
  res.json({
    session: req.session,
    user: req.user,
    isAuthenticated: req.isAuthenticated()
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});