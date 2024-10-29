import passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";
import { config } from "dotenv";
config();

const emails = ["neiraacostakevin08@gmail.com"];
const scopes = ['identify', 'email', 'guilds', 'guilds.join'];

passport.use(
  "auth-discord",
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/discord/callback",
      scope: scopes
    },
    function(accessToken, refreshToken, profile, done) {
      const response = emails.includes(profile.email);
      if (response) {
        done(null, profile);
      } else {
        emails.push(profile.email);
        done(null, profile);
      }
    }
  )
);