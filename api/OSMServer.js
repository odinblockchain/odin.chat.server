'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const level = require('level');

const db = level('./data/osm-db', {valueEncoding: 'json'});

const KeyService = require('./services/KeyService');
const keyService = new KeyService(db);

const MessageService = require('./services/MessageService');
const messageService = new MessageService(db);

const app = express();
app.use(cors());
app.use(express.json({strict: true}));
app.use(bodyParser.json());

const getKey = async (req, res) => {
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

const putKey = async (req, res) => {
    console.log(`Put message: ${JSON.stringify(req.body)}`);

    try {
        await keyService.put({...req.body});

        res.status(200).send(`OK`);
    } catch (ex) {
        console.error(`-- EX --`);
        console.error(ex);

        res.status(500).send(ex.toString());
    }
};

app.get('/keys', getKey);
app.put('/keys', putKey);

const getMessages = async (req, res) => {
    console.log(`Get messages: device [${req.query.deviceId}] registration [${req.query.registrationId}]`);

    try {
        const resp = await messageService.get(req.query.deviceId, req.query.registrationId);

        console.log(`-- RESP --`);
        console.log(resp);

        res.json(resp);

        // remove messages
        if (resp) {
            resp.forEach((m) => messageService.del(m.key));
        }

    } catch (ex) {
        console.error(`-- EX --`);
        console.error(ex);

        res.status(404).send(ex.toString());
    }
};

const putMessage = async (req, res) => {
    console.log(`Put message: ${JSON.stringify(req.body)}`);

    try {
        await messageService.put({...req.body});

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