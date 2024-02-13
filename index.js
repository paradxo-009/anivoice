const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

const categories = ['jjk', 'ds', 'bleach', 'naruto', 'aot', 'onepiece'];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function sendRandomAudioFromCategory(res, category) {
    const categoryPath = path.join('.', 'audios', category);

    fs.readdir(categoryPath, (err, files) => {
        if (err) {
            console.error(`Error reading ${category} folder:`, err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const audioFiles = files.filter(file => file.endsWith('.mp3') || file.endsWith('.wav') || file.endsWith('.ogg'));
        if (audioFiles.length === 0) {
            console.error(`No audio files found in ${category} folder.`);
            return res.status(404).json({ error: 'No audio files found in category' });
        }

        const randomIndex = Math.floor(Math.random() * audioFiles.length);
        const audioFile = audioFiles[randomIndex];
        const audioPath = path.join(categoryPath, audioFile);

        fs.readFile(audioPath, (err, data) => {
            if (err) {
                console.error(`Error reading ${audioFile}:`, err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            
            res.contentType('audio/mpeg').send(data);
        });
    });
}

app.get('/kshitiz/:category', (req, res) => {
    const category = req.params.category.toLowerCase();
    if (!categories.includes(category)) {
        return res.status(400).json({ error: 'Invalid category' });
    }

    sendRandomAudioFromCategory(res, category);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
