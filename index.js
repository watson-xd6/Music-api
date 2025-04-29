const express = require('express');
const ytdl = require('ytdl-core');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('🚀 YouTube Downloader API by Watson-XD');
});

// Download endpoint
app.get('/api/ytdl', async (req, res) => {
  const videoUrl = req.query.url;
  const format = req.query.format || 'mp3';

  if (!videoUrl) {
    return res.status(400).send({ error: 'Missing YouTube URL' });
  }

  try {
    if (format === 'mp3') {
      res.header('Content-Disposition', 'attachment; filename="audio.mp3"');
      ytdl(videoUrl, { filter: 'audioonly' }).pipe(res);
    } else if (format === 'mp4') {
      res.header('Content-Disposition', 'attachment; filename="video.mp4"');
      ytdl(videoUrl, { quality: 'highest' }).pipe(res);
    } else {
      res.status(400).send({ error: 'Invalid format. Use mp3 or mp4.' });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`✅ API is running on http://localhost:${port}`);
});
