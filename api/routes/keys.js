const keys = require('express').Router();
const validate = require('express-validation');

const db = require('../database');

const KeyService = require('../services/KeyService');
const keyService = new KeyService(db);

const logger = require('../logging');

const validation = require('./validation/keys');

const getKey = async (req, res) => {
    logger.info(`Get keys: device [${req.query.deviceId}] registration [${req.query.registrationId}]`);

    try {
        const resp = await keyService.get(req.query.deviceId, req.query.registrationId);

        logger.info(`Found keys`, resp);

        res.json(resp);
    } catch (ex) {
        logger.error(ex);

        res.status(404).send(ex.toString());
    }
};

const putKey = async (req, res) => {
    logger.info(`Put message: ${JSON.stringify(req.body)}`);

    try {
        await keyService.put({...req.body});

        res.status(200).send(`OK`);
    } catch (ex) {
        logger.error(ex);

        res.status(500).send(ex.toString());
    }
};

keys.get('/', validate(validation.GetKeys), getKey);
keys.put('/', validate(validation.RegisterKeys), putKey);

module.exports = keys;
