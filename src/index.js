import express from "express";
import { loginRouter } from "../routes/login.js";
import passport from "passport";
import "../middlewares/google.js";
import "../middlewares/discord.js";

const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(passport.initialize());

// ROUTES
// Ruta para iniciar autenticación con Google
app.get("/auth/google", 
  passport.authenticate("auth-google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
    session: false,
  })
);

// Ruta para callback de Google
app.get("/auth/google/callback",
  passport.authenticate("auth-google", { session: false }),
  (req, res) => {
    res.send(req.user);
  }
);

// Ruta para iniciar autenticación con Discord
app.get("/auth/discord", 
  passport.authenticate("auth-discord", {
    scope: ['identify', 'email', 'guilds', 'guilds.join'],
    session: false
  })
);

// Ruta para callback de Discord
app.get("/auth/discord/callback",
  passport.authenticate("auth-discord", { session: false }),
  (req, res) => {
    res.send(req.user);
  }
);

app.use("/auth", loginRouter);

app.listen(3000, () => console.log("http://localhost:5500"));