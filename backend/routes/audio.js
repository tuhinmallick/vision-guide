const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

const upload = multer();

// audio Transcription Route
router.post('/transcribe', upload.single('audio'), async (req, res) => {
    const audioBuffer = req.file.buffer;

    try {
        // ssend audio data to the transcription service (replace with your service endpoint)
        const form = new FormData();
        form.append('file', audioBuffer, { filename: 'audio.wav', contentType: 'audio/wav' });

        const response = await axios.post('TRANSCRIPTION_API_ENDPOINT', form, {
            headers: {
                ...form.getHeaders(),
                'Authorization': 'Bearer API_KEY'
            }
        });

        // xtract transcription result 
        const transcript = response.data.transcription;

        res.json({ transcript });
    } catch (error) {
        console.error('Error transcribing audio:', error);
        res.status(500).json({ error: 'Error transcribing audio' });
    }
});

module.exports = router;
