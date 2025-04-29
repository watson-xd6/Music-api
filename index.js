const express    = require('express');
const ytdl       = require('ytdl-core');
const ffmpeg     = require('fluent-ffmpeg');
const cors       = require('cors');
const stream     = require('stream');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// /api/ytmp3?url=<YouTube URL>
app.get('/api/ytmp3', async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) {
    return res.status(400).json({ error: 'Missing URL parameter' });
  }
  if (!ytdl.validateURL(videoUrl)) {
    return res.status(400).json({ error: 'Invalid YouTube URL' });
  }

  try {
    // get audio-only stream
    const audioStream = ytdl(videoUrl, { filter: 'audioonly', quality: 'highestaudio' });

    res.header('Content-Disposition', 'attachment; filename="audio.mp3"');
    res.header('Content-Type', 'audio/mpeg');

    // pipe through ffmpeg to transcode to MP3
    const ffmpegProc = ffmpeg(audioStream)
      .audioBitrate(128)
      .format('mp3')
      .on('error', err => {
        console.error('FFmpeg error:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Conversion error' });
        }
      });

    // send to response
    ffmpegProc.pipe(res, { end: true });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

app.get('/', (req, res) => {
  res.send('🎵 ytmp3-downloader is up!');
});

app.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
});
