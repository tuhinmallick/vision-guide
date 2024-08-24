const express = require('express');
const cors = require('cors');
const app = express();
const audioRoutes = require('./routes/audio');
const yoloRoutes = require('./routes/yolo');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Enable CORS

// Routes
app.use('/api/audio', audioRoutes);
app.use('/api/yolo', yoloRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
