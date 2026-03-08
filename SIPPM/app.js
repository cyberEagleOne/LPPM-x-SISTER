const express = require('express');
const db = require('./SIPPM/src/config/database');

const app = express();
app.use(express.json());

module.exports = app;