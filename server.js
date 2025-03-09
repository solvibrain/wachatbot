// server.js
require('./config/env');
const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));


const whatsappRoutes = require('./routes/whatsappRoutes');
app.use('/', whatsappRoutes);

app.listen(3000, () => console.log('Server running on port 3000'));