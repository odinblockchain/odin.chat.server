
class KeyService {

    constructor(_database) {
        this.db = _database;
    }

    async get(deviceId, registrationId) {
        console.log(`Looking up keys: device [${deviceId}] registration [${registrationId}]`);

        return this.db.get(`k-${deviceId}-${registrationId}`)
    }
}


module.exports = KeyService;
