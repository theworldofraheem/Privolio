// routes/auth.js
const express = require('express');
const passport = require('passport');
const router = express.Router();

// Start OAuth with GitHub
router.get('/github',
  passport.authenticate('github', { scope: [ 'user:email', 'repo' ] })
);

// GitHub OAuth callback
router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    // Successful login
    res.send(`✅ Logged in as ${req.user.username}`);
  }
);

// Logout route
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.send('👋 Logged out');
  });
});

// Debug: see logged in user
router.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).send('❌ Not logged in');
  }
});

module.exports = router;
