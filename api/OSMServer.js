'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Config
const config = require('config');
const apiConfig = config.get('api');

const app = express();
app.use(cors());
app.use(express.json({strict: true}));
app.use(bodyParser.json());

// TODO add authentication

const keys = require('./routes/keys');
const messages = require('./routes/messages');

app.use('/keys', keys);
app.use('/messages', messages);

app.listen(apiConfig.port, () => console.log(`listening on ${apiConfig.port}`));
