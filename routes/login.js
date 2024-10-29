import { Router } from "express";
import passport from "passport";

const loginRouter = Router();

// Rutas para Discord
loginRouter.get('/discord', 
  passport.authenticate('auth-discord', { scope: ['identify', 'email', 'guilds', 'guilds.join'] })
);

loginRouter.get('/discord/callback', 
  passport.authenticate('auth-discord', { 
    failureRedirect: '/login',
    successRedirect: '/auth/discord/profile'
  })
);

// Rutas para Facebook
loginRouter.get('/facebook',
  passport.authenticate('auth-facebook', { scope: ['email'] })
);

loginRouter.get('/facebook/callback',
  passport.authenticate('auth-facebook', {
    failureRedirect: '/login',
    successRedirect: '/auth/facebook/profile'
  })
);

// Rutas para Google
loginRouter.get('/google',
  passport.authenticate('auth-google', { 
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'] 
  })
);

loginRouter.get('/google/callback',
  passport.authenticate('auth-google', {
    failureRedirect: '/login',
    successRedirect: '/auth/google/profile'
  })
);

// Rutas de perfil protegidas
loginRouter.get("/discord/profile", ensureAuthenticated, (req, res) => res.send(req.user));
loginRouter.get("/facebook/profile", ensureAuthenticated, (req, res) => res.send(req.user));
loginRouter.get("/google/profile", ensureAuthenticated, (req, res) => res.send(req.user));

// Middleware para verificar autenticación
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