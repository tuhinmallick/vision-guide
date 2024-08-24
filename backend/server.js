
const express = require('express');
const cors = require('cors');
const speechRoutes = require('./routes/speech');

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true
}));

app.use(express.json());
app.use('/api', speechRoutes);

app.get('/', (req, res) => {
    res.send('Server is running');
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
