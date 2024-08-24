
const express = require('express');
const router = express.Router();
const axios = require('axios');
const FormData = require('form-data');

router.post('/speech-to-text', async (req, res) => {
    const audioBlob = req.files.audioBlob.data;
    const form = new FormData();
    form.append('audio', audioBlob);

    try {
        const response = await axios.post('', form, {
            headers: {
                ...form.getHeaders(),
                'Authorization': `Basic ${Buffer.from('apikey:' + process.env.IBM_API_KEY).toString('base64')}`
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error transcribing audio' });
    }
});

module.exports = router;
