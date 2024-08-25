const express = require('express');
const cors = require('cors');
const speechRoutes = require('./routes/speech');
const audioRoutes = require('./routes/audio');
const yoloRoutes = require('./routes/yolo');
const chatRoutes = require('./routes/chat');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ['http://localhost:5173', 'https://7335-2400-adc5-16a-a200-1060-7de4-8e99-9cf.ngrok-free.app/', 'http://localhost:5000/'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true
}));

// Routes
app.use('/api/audio', audioRoutes);
app.use('/api/yolo', yoloRoutes);
app.use('/api', speechRoutes);
app.use('/api', chatRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.get('/', (req, res) => {
    res.send('Server is running');
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
