
class KeyService {

    constructor(_database) {
        this.database = _database;
    }

    async get(deviceId, registrationId) {
        console.log(`Looking up keys: device [${deviceId}] registration [${registrationId}]`);

        if (deviceId && registrationId) {

            return Promise.resolve({
                "deviceId": deviceId,
                "registrationId": registrationId,
                "identityKey": "abc123",
                "signedPreKey": {
                    "id": 123456789,
                    "key": "abc123",
                    "signature": "abc123"
                },
                "preKey": {
                    "id": 123456789,
                    "key": "abc123"
                }
            });
        }

        return Promise.reject(`Not found: device [${deviceId}] registration [${registrationId}]`);
    }
}


module.exports = KeyService;
