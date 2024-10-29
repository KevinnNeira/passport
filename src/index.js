import express from "express";
import { loginRouter } from "../routes/login.js";
import passport from "passport";
import "../middlewares/google.js";
import "../middlewares/discord.js";
import "../middlewares/facebook.js";

const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(passport.initialize());

// ROUTES
// Google routes
app.get("/auth/google", 
  passport.authenticate("auth-google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
    session: false,
  })
);

app.get("/auth/google/callback",
  passport.authenticate("auth-google", { session: false }),
  (req, res) => {
    res.send(req.user);
  }
);

// Discord routes
app.get("/auth/discord", 
  passport.authenticate("auth-discord", {
    scope: ['identify', 'email', 'guilds', 'guilds.join'],
    session: false
  })
);

app.get("/auth/discord/callback",
  passport.authenticate("auth-discord", { session: false }),
  (req, res) => {
    res.send(req.user);
  }
);

// Facebook routes
app.get("/auth/facebook",
  passport.authenticate("auth-facebook", {
    scope: ['email', 'public_profile'],
    session: false
  })
);

app.get("/auth/facebook/callback",
  passport.authenticate("auth-facebook", { session: false }),
  (req, res) => {
    res.send(req.user);
  }
);

app.use("/auth", loginRouter);

app.listen(3000, () => console.log("http://localhost:3000"));