const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

const upload = multer();

router.post('/detect-objects-yolo', upload.single('image'), async (req, res) => {
    const imageBuffer = req.file.buffer;

    try {
        const form = new FormData();
        form.append('file', imageBuffer, { filename: 'image.jpg', contentType: 'image/jpeg' });

        const response = await axios.post('YOUR_YOLO_API_ENDPOINT', form, {
            headers: {
                ...form.getHeaders(),
                'Authorization': 'Bearer YOUR_YOLO_API_KEY'
            }
        });

        const objects = response.data.objects;

        res.json({ objects });
    } catch (error) {
        console.error('Error detecting objects with YOLO:', error);
        res.status(500).json({ error: 'Error detecting objects' });
    }
});

module.exports = router;
