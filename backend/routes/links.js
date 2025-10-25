// routes/links.js
const express = require('express');
const crypto = require('crypto');
const router = express.Router();

// Temporary in-memory store (use a DB later)
const linkStore = new Map();

// Auth middleware
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: 'Not authenticated' });
}

// Create shareable link
router.post('/', ensureAuthenticated, (req, res) => {
  const { full_name, expiresIn = 3600, maxViews = 10 } = req.body;

  if (!full_name) {
    return res.status(400).json({ error: 'Missing full_name (owner/repo)' });
  }

  const token = crypto.randomBytes(8).toString('hex');
  const createdAt = Date.now();
  const expiresAt = createdAt + expiresIn * 1000;

  linkStore.set(token, {
    token,
    owner: req.user.username,
    full_name,
    expiresAt,
    remainingViews: maxViews,
    createdAt
  });

  const shareLink = `http://localhost:3000/view/${token}`;
  res.json({ shareLink });
});

// Optional: expose the link store for testing/debugging
router.get('/debug', (req, res) => {
  res.json(Array.from(linkStore.values()));
});
const axios = require('axios');

// GET /view/:token
router.get('/view/:token', async (req, res) => {
  const token = req.params.token;
  const link = linkStore.get(token);

  if (!link) {
    return res.status(404).json({ error: 'Invalid or expired link' });
  }

  // Check expiry
  if (Date.now() > link.expiresAt) {
    linkStore.delete(token);
    return res.status(410).json({ error: 'Link has expired' });
  }

  // Check remaining views
  if (link.remainingViews <= 0) {
    linkStore.delete(token);
    return res.status(410).json({ error: 'View limit reached' });
  }

  // Decrement view count
  link.remainingViews--;

  try {
    // TEMP: use a fixed file path just to show something
    const repoFullName = link.full_name;

    const user = req.user; // Optional: req.user may be undefined (public link)
    const accessToken = user?.accessToken; // May not exist

    // Get default branch (needed to build file path)
    const repoRes = await axios.get(`https://api.github.com/repos/${repoFullName}`, {
      headers: accessToken ? {
        Authorization: `token ${accessToken}`
      } : {}
    });

    const branch = repoRes.data.default_branch;

    // Fetch README.md as a test (replace with dynamic file tree later)
    const fileRes = await axios.get(
      `https://api.github.com/repos/${repoFullName}/contents/README.md?ref=${branch}`,
      {
        headers: accessToken ? {
          Authorization: `token ${accessToken}`
        } : {}
      }
    );

    const file = fileRes.data;

    res.json({
      repo: repoFullName,
      branch,
      file: {
        name: file.name,
        path: file.path,
        encoding: file.encoding,
        content: Buffer.from(file.content, 'base64').toString('utf-8')
      },
      remainingViews: link.remainingViews
    });

  } catch (err) {
    console.error('❌ Error fetching file:', err.message);
    res.status(500).json({ error: 'Could not fetch repo content' });
  }
});

module.exports = { router, linkStore };
