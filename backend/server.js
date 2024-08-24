const express = require('express');
const app = express();
const yoloRoutes = require('./routes/yolo');

// middleware
app.use(express.json());

// moutes
app.use('/api/yolo', yoloRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
