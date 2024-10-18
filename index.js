require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/auth');

const PORT = process.env.PORT || 3000;
const DB = process.env.DB_URI;
const YOUR_IP_ADDRESS = process.env.LOCAL_IP;

const app = express();

// Add middleware to parse JSON before routes
app.use(express.json());
app.use(router);

mongoose.connect(DB).then(() => {
    console.log("Database connected!!!!");
}).catch((e) => {
    console.log("Database connection error: " + e);
});

app.listen(PORT, YOUR_IP_ADDRESS, function () {
    console.log('Server is running at ' + YOUR_IP_ADDRESS + ':' + PORT);
});
