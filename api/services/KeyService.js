
class KeyService {

    constructor(_database) {
        this.db = _database;
    }

    async get(deviceId, registrationId) {
        console.log(`Looking up keys: device [${deviceId}] registration [${registrationId}]`);

        return this.db.get(`k-${deviceId}-${registrationId}`)
    }

    async put(key) {
        const {deviceId, registrationId} = key;
        console.log(`Put key:  device [${deviceId}] registration [${registrationId}]`);

        const keyObj = {
            ...key,
        };
        return this.db.put(`k-${deviceId}-${registrationId}`, keyObj);
    }
}


module.exports = KeyService;
