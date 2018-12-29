const logger = require('../logging');
const _ = require('lodash');

class KeyService {

  constructor(_database) {
    this.db = _database;
  }

  async getAll(name, registrationId, deviceId) {
    logger.info(`Find Keys: name[${name}] registration[${registrationId}] device[${deviceId}]`);

    return this.db.get(`k-${name}-${registrationId}-${deviceId}`);
  }

  async getNextKey(name, registrationId, deviceId) {
    logger.info(`Find Next Key: name[${name}] registration[${registrationId}] device[${deviceId}]`);

    const keys = await this.db.get(`k-${name}-${registrationId}-${deviceId}`);
    console.log(keys);

    // FIXME handle replenishing of preKeys will be needed once you run out out preKeys - for now re-use key
    const preKeyToUse = keys.preKeys.length > 1
        ? keys.preKeys.pop()
        : keys.preKeys[0];

    // Copy obj without the full array of preKeys
    const keyObj = _.omit(_.clone(keys), 'preKeys');

    // Update the keys - without the plucked preKey
    await this.put(keys);

    // Send back the object with only one key
    return _.merge(keyObj, {
      preKey: preKeyToUse
    });
  }

  async put(keyReq) {
    const { name, registrationId, deviceId } = keyReq.address;
    logger.info(`Put key: name[${name}] registration[${registrationId}] device[${deviceId}]`);

    let user = null;
    try {
      user = await this.db.get(`k-${name}-${registrationId}-${deviceId}`);
      logger.info(`Update store: name[${name}] registration[${registrationId}] device[${deviceId}]`);
      
      return this.db.put(`k-${name}-${registrationId}-${deviceId}`, keyReq);
    } catch (err) {
      if (err.type === 'NotFoundError') {
        logger.info(`New store: name[${name}] registration[${registrationId}] device[${deviceId}]`);
        return this.db.put(`k-${name}-${registrationId}-${deviceId}`, keyReq);
      } else {
        logger.info(`Level error detected`);
        throw err;
      }
    }
  }
}

module.exports = KeyService;
