import { Router } from "express";


const loginRouter = Router();

loginRouter.get("/google", (req, res) => res.send(req.user));

loginRouter.get("/discord/profile", (req, res) => res.send(req.user));

loginRouter.get("/facebook/profile", (req, res) => res.send(req.user));

export { loginRouter };