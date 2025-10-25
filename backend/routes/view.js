// routes/view.js
const express = require('express');
const axios = require('axios');
const { linkStore } = require('./links'); // 👈 reuse the store
const router = express.Router();

router.get('/:token', async (req, res) => {
  const token = req.params.token;
  const link = linkStore.get(token);

  if (!link) {
    return res.status(404).json({ error: 'Invalid or expired link' });
  }

  if (Date.now() > link.expiresAt) {
    linkStore.delete(token);
    return res.status(410).json({ error: 'Link has expired' });
  }

  if (link.remainingViews <= 0) {
    linkStore.delete(token);
    return res.status(410).json({ error: 'View limit reached' });
  }

  link.remainingViews--;

  try {
    const repoFullName = link.full_name;
    const accessToken = req.user?.accessToken;

    const repoRes = await axios.get(`https://api.github.com/repos/${repoFullName}`, {
      headers: accessToken ? {
        Authorization: `token ${accessToken}`
      } : {}
    });

    const branch = repoRes.data.default_branch;

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

module.exports = router;
