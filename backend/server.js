
const express = require('express');
const cors = require('cors');
const speechRoutes = require('./routes/speech');

const cors = require('cors');
const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true
}));

const audioRoutes = require('./routes/audio');
const yoloRoutes = require('./routes/yolo');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// rroutes
app.use('/api/audio', audioRoutes);
app.use('/api/yolo', yoloRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
