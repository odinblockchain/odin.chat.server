const _ = require('lodash');
const prefs = require('express').Router();
const validate = require('express-validation');
const db = require('../database');

const logger = require('../logging');
const validation = require('./validation/prefs');

const PreferenceService = require('../services/PreferenceService');
const preferenceService = new PreferenceService(db);

const putPrefs = async (req, res) => {
  try {
    await preferenceService.put(req.body);

    const { name } = req.body.address;

    // Send back status
    res.status(200)
    .json({
      status: 'ok'
    });
  } catch (err) {
    console.log('GOT ERR', err.message ? err.message : err);
    logger.error(err);
    res.status(500)
    .send(err.message);
  }
};

// Manage prefs
prefs.put('/', validate(validation), putPrefs);

module.exports = prefs;
