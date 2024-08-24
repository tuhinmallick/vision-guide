
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const audioRoutes = require('./routes/audio');
const imageRoutes = require('./routes/image');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.use('/api/audio', audioRoutes);
// app.use('/api/image', imageRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
