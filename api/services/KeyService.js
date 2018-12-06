const logger = require('../logging');
const _ = require('lodash');

class KeyService {

    constructor(_database) {
        this.db = _database;
    }

    async getAll(deviceId, registrationId) {
        logger.info(`Looking up keys: device [${deviceId}] registration [${registrationId}]`);

        return this.db.get(`k-${deviceId}-${registrationId}`);
    }

    async getNextKey(deviceId, registrationId) {
        logger.info(`Looking up next keys: device [${deviceId}] registration [${registrationId}]`);

        const keys = await this.db.get(`k-${deviceId}-${registrationId}`);
        console.log(keys);

        // TODO handle replenishing of preKeys

        const preKeyToUse = keys.preKeys.length > 1
            ? keys.preKeys.pop()
            : keys.preKeys[0];

        // Copy obj without the full array of preKeys
        const keyObj = _.omit(_.clone(keys), 'preKeys');

        // Update the keys
        await this.put(keys);

        // Send back the objc with only one key
        return _.merge(keyObj, {
            preKey: preKeyToUse
        });
    }

    async put(key) {
        const {deviceId, registrationId} = key;
        logger.info(`Put key:  device [${deviceId}] registration [${registrationId}]`);

        const keyObj = {
            ...key,
        };
        return this.db.put(`k-${deviceId}-${registrationId}`, keyObj);
    }
}

module.exports = KeyService;
