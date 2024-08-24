
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
require('dotenv').config();

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const speechToText = new SpeechToTextV1({
    authenticator: new IamAuthenticator({
        apikey: process.env.SPEECH_TO_TEXT_API_KEY,
    }),
    serviceUrl: process.env.SPEECH_TO_TEXT_URL,
});

router.post('/speech-to-text', upload.single('audio'), (req, res) => {
    const inputFilePath = req.file.path;
    const outputFilePath = `${inputFilePath}.wav`;

    // Convert to WAV using ffmpeg
    ffmpeg(inputFilePath)
        .output(outputFilePath)
        .toFormat('wav')
        .on('end', () => {
            const recognizeParams = {
                audio: fs.createReadStream(outputFilePath),
                contentType: 'audio/wav',
                model: 'en-US_BroadbandModel',
            };

            speechToText
                .recognize(recognizeParams)
                .then((response) => {
                    const transcription = response.result.results
                        .map((result) => result.alternatives[0].transcript)
                        .join('\n');

                    res.json({ transcription });

                    // Clean up
                    fs.unlinkSync(inputFilePath);
                    fs.unlinkSync(outputFilePath);
                })
                .catch((error) => {
                    console.error('Error processing audio:', error);
                    res.status(500).json({ error: 'Failed to transcribe audio' });
                });
        })
        .on('error', (err) => {
            console.error('Error during conversion:', err);
            res.status(500).json({ error: 'Audio conversion failed' });
        })
        .run();
});

module.exports = router;
