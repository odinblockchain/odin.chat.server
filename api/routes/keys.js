const _ = require('lodash');

const keys = require('express').Router();
const validate = require('express-validation');

const db = require('../database');

const KeyService = require('../services/KeyService');
const keyService = new KeyService(db);

const logger = require('../logging');

const validation = require('./validation/keys');

const getKey = async (req, res) => {
  const { name, registrationId, deviceId } = req.query;
  logger.info(`Request::GetKey name[${name}] registration[${registrationId}] device[${deviceId}]`);

  try {
    const resp = await keyService.getNextKey(name, registrationId, deviceId);
    logger.info(`Found keys`, resp);
    res.json(resp);
  } catch (ex) {
    logger.error(ex);
    res.status(404).send(ex.toString());
  }
};

const putKey = async (req, res) => {
  logger.info(`Put keys: ${JSON.stringify(req.body)}`);
  try {
    await keyService.put({...req.body});

    const { name, registrationId, deviceId } = req.body.address;
    const resp = await keyService.getAll(name, registrationId, deviceId);

    // Send back count of keys stored
    res.status(200).json({
      count: _.size(resp.publicPreKeys)
    });
  } catch (ex) {
    logger.error(ex);
    res.status(500).send(ex.toString());
  }
};

const getPreKeyCount = async (req, res) => {
  const { name, registrationId, deviceId } = req.query;
  logger.info(`Request::GetKeyCount name[${name}] registration[${registrationId}] device[${deviceId}]`);

  try {
    const resp = await keyService.getAll(name, registrationId, deviceId);
    res.status(200).json({
      count: _.size(resp.publicPreKeys)
    });
  } catch (ex) {
    logger.error(ex);
    res.status(500).send(ex.toString());
  }
};

// Get pre-key count
keys.get('/count', validate(validation.KeyLookupParams), getPreKeyCount);

// Manage pre-keys
keys.get('/', validate(validation.KeyLookupParams), getKey);
keys.put('/', validate(validation.RegisterKeys), putKey);

module.exports = keys;
