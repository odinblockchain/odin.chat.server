
class MessageService {

    constructor(_database) {
        this.db = _database;
    }

    async get(deviceId, registrationId) {
        console.log(`Looking up messages: device [${deviceId}] registration [${registrationId}]`);

        return this.db.get(`${deviceId}-${registrationId}`)
    }
}


module.exports = MessageService;
