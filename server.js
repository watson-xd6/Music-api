const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// API Route
app.get('/api/ytdl', async (req, res) => {
    const videoUrl = req.query.url;
    const format = req.query.format || 'mp4'; // optional format

    if (!videoUrl) {
        return res.status(400).json({ error: 'Missing YouTube URL parameter: url' });
    }

    try {
        if (!ytdl.validateURL(videoUrl)) {
            return res.status(400).json({ error: 'Invalid YouTube URL' });
        }

        const info = await ytdl.getInfo(videoUrl);
        const formatFilter = (format === 'mp4') ? 'videoandaudio' : 'audioonly';

        const formatStream = ytdl(videoUrl, { quality: 'highest', filter: formatFilter });

        res.header('Content-Disposition', `attachment; filename="video.${format === 'mp4' ? 'mp4' : 'mp3'}"`);
        formatStream.pipe(res);

    } catch (err) {
        console.error(err);
        res.status(500).json( error: 'Failed to download the video' );
    );

app.get('/', (req, res) => 
    res.send('🎬 YouTube Download API is running!');
);

app.listen(PORT, () => 
    console.log(`✅ Server is running at http://localhost:{PORT}`);
});
