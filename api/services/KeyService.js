const logger = require('../logging');
const _ = require('lodash');
// const metrics = require('../libs/metrics');

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

    // FIXME handle replenishing of preKeys will be needed once you run out out preKeys
    // - for now re-use key
    // keys.preKeys = [];

    const nextPreKey = (identityBundle.preKeys.length > 0)
                          ? identityBundle.preKeys.pop()
                          : false;

    // Copy obj without the full array of preKeys
    // const keyObj = _.omit(_.clone(keys), 'publicPreKeys');
    console.log(identityBundle);
    logger.info(`KeyService
      event: [pull prekey bundle]
      user:
        name:     ${identityBundle.address.name}
        regId:    ${identityBundle.address.registrationId}
        devId     ${identityBundle.address.deviceId}
        preKeys:  ${identityBundle.preKeys.length}
      fcm:
        token:    ${identityBundle.fcmToken}
      `);

    // Update the keys - without the plucked preKey
    // await this.put(identityBundle);
    await this.db.put(`k-${name}`, identityBundle);

    // Send back the object with only one key
    const identityPackage = _.omit(_.clone(identityBundle), 'preKeys', 'fcmToken');
    return _.merge(identityPackage, {
      publicPreKey: nextPreKey
    });
  }

  async put({ address, preKeys, identityPubKey, signedPreKey, fcmToken }) {
    const { name, registrationId, deviceId } = address;
    
    let user = null;
    try {
      user = await this.db.get(`k-${name}`);
      logger.info(`...updating [${name}]`);

      if ((user.preKeys.length + preKeys.length) > 300) {
        logger.info(`...max keys [${name}]`);
        // throw new Error('UserMaxPreKeys');
      } else {
        const preKeyIds = user.preKeys.map((key) => key.id);
        preKeys.forEach((preKey) => {
          if (preKeyIds.indexOf(preKey.id) === -1) {
            user.preKeys.push(preKey);
          }
        });
      }
      
      logger.info(`KeyService
      event: [update]
      user:
        name:     ${name}
        regId:    ${registrationId} (${user.registrationId})
        devId     ${deviceId} (${user.deviceId})
        preKeys:  ${preKeys.length}
      identityPubKey:
        key: ${identityPubKey}
      signedPreKey:
        id: ${signedPreKey.id}
        pubKey: ${signedPreKey.pubKey}
        sig: ${signedPreKey.signature}
        id: ${signedPreKey.id}
      preKey[0]:
        id: ${preKeys[0].id}
        pubKey: ${preKeys[0].pubKey}
      fcm:
        token: ${fcmToken} (${user.fcmToken})
      `);

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

      // update some user settings below
      user.fcmToken = fcmToken;
      user.registrationId = registrationId;
      user.deviceId = deviceId;

      return this.db.put(`k-${name}`, user);
    } catch (err) {
      console.log('GOT ERROR');
      console.log(err.type);

      if (err.type === 'NotFoundError') {
        logger.info(`
        event: [create]
        user:
          name:     ${name}
          regId:    ${registrationId}
          devId     ${deviceId}
          preKeys:  ${preKeys.length}
        identityPubKey:
          key: ${identityPubKey}
        signedPreKey:
          id: ${signedPreKey.id}
          pubKey: ${signedPreKey.pubkey}
          sig: ${signedPreKey.signature}
          id: ${signedPreKey.id}
        preKey[0]:
          id: ${preKeys[0].id}
          pubKey: ${preKeys[0].pubKey}
        fcm:
          token: ${fcmToken}
        `);


        return this.db.batch()
                .put(`f-${deviceId}${registrationId}`, {
                  fcmToken
                })
                .put(`k-${name}`, {
                  address,
                  identityPubKey,
                  signedPreKey,
                  preKeys,
                  fcmToken
                })
                .write();
      } else {
        logger.info(`Level error detected`);
        throw err;
      }
    }
  }
}

module.exports = KeyService;
