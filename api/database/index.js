const level = require('level');
const logger = require('../logging');

// Config
const config = require('config');
const dbConfig = config.get('levelDb');

const db = level(dbConfig.path, {
  valueEncoding: 'json'
});

db.on('put', function (key, value) {
  logger.info(`[db] inserted ${key}`);
})

module.exports = db;
