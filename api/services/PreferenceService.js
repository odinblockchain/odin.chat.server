const logger = require('../logging');
const _ = require('lodash');

class PreferenceService {

  constructor(_database) {
    this.db = _database;
  }

  async put({ address: { name, registrationId, deviceId }, fcmToken }) {
    let user = null;
    
    try {
      user = await this.db.get(`k-${name}`);
      logger.info(`...updating prefs [${name}]`);

      logger.info(`PreferenceService
      event: [update]
      user:
        name:     ${name}
        regId:    ${registrationId} > (${user.registrationId})
        devId     ${deviceId} > (${user.deviceId})
      fcm:
        token: ${fcmToken} > (${user.fcmToken})
      `);

      // update some user settings below (if provided)
      user.fcmToken = (fcmToken || fcmToken === '') ? fcmToken : user.fcmToken;
      return this.db.put(`k-${name}`, user);
    } catch (err) {
      console.log('GOT ERROR');
      console.log(err.type);

      logger.info(`Level error detected`);
      throw err;
    }
  }
}

module.exports = PreferenceService;
