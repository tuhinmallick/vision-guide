const express = require('express');
const app = express();
const audioRoutes = require('./routes/audio');
const yoloRoutes = require('./routes/yolo');

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// rroutes
app.use('/api/audio', audioRoutes);
app.use('/api/yolo', yoloRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
