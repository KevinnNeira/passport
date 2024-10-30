import passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";
import { config } from "dotenv";
import { saveUserData } from './auth.js';

config();

const scopes = ['identify', 'email', 'guilds', 'guilds.join'];

const discordStrategy = () => {
  passport.use(
    "auth-discord",
    new DiscordStrategy(
      {
        clientID: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        callbackURL: "https://passport-7kej9odrp-kevinnneiras-projects.vercel.app/auth/discord/callback",
        scope: scopes
      },
      async function(accessToken, refreshToken, profile, done) {
        try {
          const user = await saveUserData(profile, 'discord');
          done(null, user);
        } catch (error) {
          console.error('Error en autenticación de Discord:', error);
          done(error, null);
        }
      }
    )
  );
};

export default discordStrategy;