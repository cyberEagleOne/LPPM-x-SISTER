const express = require('express');
const db = require('./config/database');

const app = express();
app.use(express.json());

module.exports = app;