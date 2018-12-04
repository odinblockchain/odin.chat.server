'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(express.json({strict: true}));
app.use(bodyParser.json());

// TODO add authentication
// TODO add JSON Schema validator once API more defined

const keys = require('./routes/keys');
const messages = require('./routes/messages');

app.use('/keys', keys);
app.use('/messages', messages);

// Catch all others
app.get('*', function (req, res) {
    res.status(404).json({
        error: "unknown route"
    });
});

module.exports = app;
