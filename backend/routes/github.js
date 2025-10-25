// routes/github.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

// Auth check middleware
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: 'Not authenticated' });
}

// GET /api/github/repos
router.get('/repos', ensureAuthenticated, async (req, res) => {
  try {
    const accessToken = req.user.accessToken;

    const response = await axios.get('https://api.github.com/user/repos', {
      headers: {
        Authorization: `token ${accessToken}`
      },
      params: {
        visibility: 'all', // include private repos
        affiliation: 'owner', // only owned repos
        per_page: 100
      }
    });

    const repos = response.data.map(repo => ({
      name: repo.name,
      full_name: repo.full_name,
      private: repo.private,
      description: repo.description,
      html_url: repo.html_url,
      clone_url: repo.clone_url,
      language: repo.language
    }));

    res.json(repos);

  } catch (err) {
    console.error('❌ Error fetching repos:', err.message);
    res.status(500).json({ error: 'Failed to fetch GitHub repositories' });
  }
});

module.exports = router;
