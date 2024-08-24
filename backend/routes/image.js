
const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/classify-image', async (req, res) => {
    const image = req.files.image.data;

    try {
        const response = await axios.post('', image, {
            headers: {
                'Authorization': `Basic ${Buffer.from('apikey:' + process.env.IBM_API_KEY).toString('base64')}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error classifying image' });
    }
});

module.exports = router;
