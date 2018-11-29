
class MessageService {

    constructor(_database) {
        this.db = _database;
    }

    async get(deviceId, registrationId) {
        console.log(`Looking up messages: device [${deviceId}] registration [${registrationId}]`);

        return this.db.get(`m-${deviceId}-${registrationId}`)
    }

    async put(message, timestamp = new Date().getTime()) {
        const {destinationDeviceId, destinationRegistrationId} = message;
        console.log(`Put message:  device [${destinationDeviceId}] registration [${destinationRegistrationId}]`);

        const msgObj = {
            ...message,
            timestamp: timestamp
        };
        return this.db.put(`m-${destinationDeviceId}-${destinationRegistrationId}`, msgObj);
    }
}


module.exports = MessageService;
