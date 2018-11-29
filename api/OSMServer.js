'use strict';

const express = require('express');
const cors = require('cors');

const level = require('level');

const db = level('./data/osm-db', { valueEncoding: 'json' });

db.put('123-456', {
    "deviceId": "123",
    "registrationId": "456",
    "identityKey": "asdklj",
    "signedPreKey": {
        "id": 666,
        "key": "asdasd",
        "signature": "asdfsdf"
    },
    "preKey": {
        "id": 444,
        "key": "asdasd"
    }
});

const KeyService = require('./services/KeysService');
const keysService = new KeyService(db);

const app = express();
app.use(cors());
app.use(express.json({strict: true}));

const getKeys = async (req, res) => {
    console.log(`Get keys: device [${req.query.deviceId}] registration [${req.query.registrationId}]`);

    try {
        const resp = await keysService.get(req.query.deviceId, req.query.registrationId);

        console.log(`-- RESP --`);
        console.log(resp.toString());

        res.json(resp);
    } catch (ex) {
        console.error(`-- EX --`);
        console.error(ex);

        res.status(404).send(ex.toString());
    }
};

app.get('/keys', getKeys);

app.listen(3000, () => console.log('listening on 3000'));