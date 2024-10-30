import { Router } from "express";
import passport from "passport";

const loginRouter = Router();

// Rutas para Discord (sin tocar)
loginRouter.get('/discord',
  passport.authenticate('auth-discord', { scope: ['identify', 'email', 'guilds', 'guilds.join'] })
);

loginRouter.get('/discord/callback',
  passport.authenticate('auth-discord', {
    failureRedirect: '/login',
    successRedirect: '/auth/discord/profile'
  })
);

// Rutas de Google
loginRouter.get('/google',
  passport.authenticate('auth-google', {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ]
  })
);

loginRouter.get('/google/callback',
  passport.authenticate('auth-google', {
    failureRedirect: '/login'
  }),
  (req, res) => {
    res.send(req.user);
  }
);

// Nuevas rutas de Facebook
loginRouter.get('/facebook',
  passport.authenticate('auth-facebook', {
    scope: ['email', 'public_profile'],
    session: false
  })
);

loginRouter.get('/facebook/callback',
  passport.authenticate('auth-facebook', { session: false }),
  (req, res) => {
    res.send(req.user);
  }
);

loginRouter.get("/facebook/profile", (req, res) => res.send(req.user));

// Ruta protegida solo para Discord
loginRouter.get("/discord/profile", ensureAuthenticated, (req, res) => res.send(req.user));

// Middleware para verificar autenticación (solo usado por Discord)
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// Ruta de logout
loginRouter.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

export { loginRouter };