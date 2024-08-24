const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');

const upload = multer();

// yyolo object Detection Route
router.post('/detect-objects-yolo', upload.single('image'), async (req, res) => {
    const image = req.file.buffer;

    try {
        const response = await axios.post('YOLO_API_ENDPOINT/detect', image, {
            headers: {
                'Content-Type': 'application/octet-stream',
            }
        });

        // adjust based on YOLO API response structure
        const objects = response.data.objects.map(obj => ({
            class: obj.class,
            score: obj.score
        }));

        res.json({ objects });
    } catch (error) {
        console.error('Error detecting objects with YOLO:', error);
        res.status(500).json({ error: 'Error detecting objects with YOLO' });
    }
});

module.exports = router;
