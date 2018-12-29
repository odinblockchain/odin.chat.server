const logger = require('../logging');
const _ = require('lodash');

class KeyService {

  constructor(_database) {
    this.db = _database;
  }

  async getAll(name) {
    logger.info(`Find Keys: name[${name}]`);

    let user = await this.db.get(`k-${name}`);
    delete user.address.registrationId;
    delete user.address.deviceId;

    return user;
  }

  async getNextKey(name) {
    logger.info(`Find Next Key: name[${name}]`);

    const keys = await this.db.get(`k-${name}`);
    delete keys.address.registrationId;
    delete keys.address.deviceId;
    
    console.log(keys);

    // FIXME handle replenishing of publicPreKeys will be needed once you run out out publicPreKeys
    // - for now re-use key
    const preKeyToUse = keys.publicPreKeys.length > 1
        ? keys.publicPreKeys.pop()
        : keys.publicPreKeys[0];

    // Copy obj without the full array of publicPreKeys
    const keyObj = _.omit(_.clone(keys), 'publicPreKeys');

    // Update the keys - without the plucked preKey
    await this.put(keys);

    // Send back the object with only one key
    return _.merge(keyObj, {
      publicPreKey: preKeyToUse
    });
  }

  async put(keyReq) {
    const { name, registrationId, deviceId } = keyReq.address;
    logger.info(`Put key: name[${name}] registration[${registrationId}] device[${deviceId}]`);

    let user = null;
    try {
      user = await this.db.get(`k-${name}`);
      logger.info(`Update store: name[${name}] registration[${registrationId}] device[${deviceId}]`);
      
      return this.db.put(`k-${name}`, keyReq);
    } catch (err) {
      if (err.type === 'NotFoundError') {
        logger.info(`New store: name[${name}] registration[${registrationId}] device[${deviceId}]`);
        return this.db.put(`k-${name}`, keyReq);
      } else {
        logger.info(`Level error detected`);
        throw err;
      }
    }
  }
}

module.exports = KeyService;
