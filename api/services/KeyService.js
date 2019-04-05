const logger = require('../logging');
const _ = require('lodash');

class KeyService {

  constructor(_database) {
    this.db = _database;
  }

  async getAll(name) {
    logger.info(`Find Keys: name[${name}]`);

    let user = await this.db.get(`k-${name}`);
    // delete user.address.registrationId;
    // delete user.address.deviceId;

    return user;
  }

  async getNextKey(name) {
    logger.info(`Find Next Key: name[${name}]`);

    const identityBundle = await this.db.get(`k-${name}`);
    // delete keys.address.registrationId;
    // delete keys.address.deviceId;
    
    console.log('BEFORE...', {
      address:    identityBundle.address,
      totalKeys:  identityBundle.preKeys.length,
      lastKey:    identityBundle.preKeys[identityBundle.preKeys.length - 1]
    });

    // FIXME handle replenishing of preKeys will be needed once you run out out preKeys
    // - for now re-use key
    // keys.preKeys = [];

    let nextPreKey;
    if (identityBundle.preKeys.length === 0) {
      nextPreKey = false;
    } else {
      nextPreKey = identityBundle.preKeys.pop();
    }

    // Copy obj without the full array of preKeys
    // const keyObj = _.omit(_.clone(keys), 'publicPreKeys');

    console.log('AFTER...', {
      address:    identityBundle.address,
      totalKeys:  identityBundle.preKeys.length,
      lastKey:    identityBundle.preKeys[identityBundle.preKeys.length - 1]
    });

    // Update the keys - without the plucked preKey
    // await this.put(identityBundle);
    await this.db.put(`k-${name}`, identityBundle);
    console.log('...done');

    // Send back the object with only one key
    const identityPackage = _.omit(_.clone(identityBundle), 'preKeys');
    return _.merge(identityPackage, {
      publicPreKey: nextPreKey
    });
  }

  // function preKeyExists()

  async put(keyReq) {
    const { name, registrationId, deviceId } = keyReq.address;
    logger.info(`Put key: name[${name}] registration[${registrationId}] device[${deviceId}]`);

    let user = null;
    try {
      user = await this.db.get(`k-${name}`);
      logger.info(`Update store: name[${name}] registration[${registrationId}] device[${deviceId}]`);
      
      if ((user.preKeys.length + keyReq.preKeys.length) > 300) {
        throw new Error('UserMaxPreKeys');
      }

      /**
       * user.address.name
       * user.address.deviceId
       * user.address.registrationId
       * 
       * user.identityPubKey
       * 
       * user.signedPreKey.id
       * user.signedPreKey.pubKey
       * user.signedPreKey.signature
       * 
       * user.preKeys[]
       * user.preKeys[].id
       * user.preKeys[].pubKey
       */

      let preKeyIds = user.preKeys.map((key) => key.id);
      keyReq.preKeys.forEach((preKey) => {
        if (preKeyIds.indexOf(preKey.id) === -1) {
          user.preKeys.push(preKey);
        }
      });

      return this.db.put(`k-${name}`, user);
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
