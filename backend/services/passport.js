// services/passport.js
require('dotenv').config(); // 👈 Add this line at the top

const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
  console.error("❌ Missing GitHub OAuth credentials in .env");
  process.exit(1);
}

passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // Attach the accessToken to the profile so we can use it later
    profile.accessToken = accessToken;
    return done(null, profile);
  }
));


passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
