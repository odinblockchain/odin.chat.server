'use strict';

const express = require('express');
const cors = require('cors');

const KeyService = require('./services/KeysService');
const keysService = new KeyService(null);

const app = express();
app.use(cors());
app.use(express.json({strict: true}));

const getKeys = async (req, res) => {
    console.log(`Get keys: device [${req.query.deviceId}] registration [${req.query.registrationId}]`);

    try {
        const resp = await keysService.get(req.query.deviceId, req.query.registrationId);
        res.json(resp);
    } catch (ex) {
        console.error(ex);
        res.status(404).send(ex);
    }
};

app.get('/keys', getKeys);

app.listen(3000, () => console.log('listening on 3000'));