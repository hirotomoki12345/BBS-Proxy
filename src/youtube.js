const express = require('express');
const cors = require('cors');
const ytdl = require("ytdl-core");
const app = express();

app.use(cors());
app.listen(3000, () => {
    console.log('Server Works !!! At port 3000');
});

app.get('/', (req, res) => {
    res.send('ページが表示されました！');
});

// Function to format the URL
function formatURL(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/;
    const match = url.match(regex);
    return match ? `https://www.youtube.com/watch?v=${match[1]}` : null;
}

app.get("/download", (req, res) => {
    var URL = req.query.url;
    console.log("Original URL:", URL);
    
    var formattedURL = formatURL(URL);
    if (!formattedURL) {
        return res.status(400).send("Invalid URL");
    }
    
    console.log("Formatted URL:", formattedURL);

    var stream = ytdl(formattedURL);
    stream.on('info', (info) => {
        console.log(info.title);
        console.log(info.video_id);
        res.header('Content-Disposition', 'attachment; filename="video.mp4"');
        ytdl(formattedURL, {
            format: 'mp4'
        }).pipe(res);
    });
});
