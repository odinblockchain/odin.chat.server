const _ = require('lodash');

const keys = require('express').Router();
const validate = require('express-validation');

const db = require('../database');

const KeyService = require('../services/KeyService');
const keyService = new KeyService(db);

const logger = require('../logging');

const validation = require('./validation/keys');

const getKey = async (req, res) => {
  const { user } = req.query;
  logger.info(`Request::GetNextKey name[${user}]`);

  try {
    const resp = await keyService.getNextKey(user);
    logger.info(`Found keys`, resp);
    res.json(resp);
  } catch (ex) {
    logger.error(ex);
    res.status(404).send(ex.toString());
  }
};

const putKey = async (req, res) => {
  try {
    await keyService.put(req.body);

    const { name } = req.body.address;
    const resp = await keyService.getAll(name);

    // Send back count of keys stored
    res.status(200)
    .json({
      count: _.size(resp.preKeys)
    });
  } catch (ex) {
    logger.error(ex);
    res.status(500).send(ex.toString());
  }
};

const getPreKeyCount = async (req, res) => {
  const { user } = req.query;
  logger.info(`Request::GetKeyCount name[${user}]`);

  try {
    const resp = await keyService.getAll(user);
    res.status(200).json({
      count: _.size(resp.preKeys)
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
