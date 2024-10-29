import express from 'express';
import passport from 'passport';
import session from 'express-session';
import { connectDB } from '../utils/db.js';
import { loginRouter } from '../routes/login.js';
import discordStrategy from '../middlewares/discord.js';
import facebookStrategy from '../middlewares/facebook.js';
import googleStrategy from '../middlewares/google.js';
import { User } from '../models/user.js';

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

// Inicializar estrategias
discordStrategy();
facebookStrategy();
googleStrategy();

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