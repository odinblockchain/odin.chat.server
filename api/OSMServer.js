'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const level = require('level');

const db = level('./data/osm-db', { valueEncoding: 'json' });

db.put('k-123-456', {
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

const KeyService = require('./services/KeyService');
const keyService = new KeyService(db);

const MessageService = require('./services/MessageService');
const messageService = new MessageService(db);

const app = express();
app.use(cors());
app.use(express.json({strict: true}));
app.use(bodyParser.json());

const getKeys = async (req, res) => {
    console.log(`Get keys: device [${req.query.deviceId}] registration [${req.query.registrationId}]`);

    try {
        const resp = await keyService.get(req.query.deviceId, req.query.registrationId);

        console.log(`-- RESP --`);
        console.log(resp);

        res.json(resp);
    } catch (ex) {
        console.error(`-- EX --`);
        console.error(ex);

        res.status(404).send(ex.toString());
    }
};

app.get('/keys', getKeys);

const getMessages = async (req, res) => {
    console.log(`Get messages: device [${req.query.deviceId}] registration [${req.query.registrationId}]`);

    try {
        const resp = await messageService.get(req.query.deviceId, req.query.registrationId);

        console.log(`-- RESP --`);
        console.log(resp);

        res.json(resp);
    } catch (ex) {
        console.error(`-- EX --`);
        console.error(ex);

        res.status(404).send(ex.toString());
    }
};

const putMessage = async (req, res) => {
    console.log(`Put message: ${JSON.stringify(req.body)}`);

    try {
        await messageService.put({
            destinationDeviceId: req.body.destinationDeviceId,
            destinationRegistrationId: req.body.destinationRegistrationId,
            ciphertextMessage: req.body.ciphertextMessage
        });

        res.status(200).send(`OK`);
    } catch (ex) {
        console.error(`-- EX --`);
        console.error(ex);

        res.status(500).send(ex.toString());
    }
};

app.get('/messages', getMessages);
app.put('/messages', putMessage);

app.listen(3000, () => console.log('listening on 3000'));